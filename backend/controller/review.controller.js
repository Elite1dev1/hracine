const mongoose = require("mongoose");
const Order = require("../model/Order");
const Products = require("../model/Products");
const Review = require("../model/Review");
const User = require("../model/User");

exports.addReview = async (req, res, next) => {
  try {
    const { userId, productId, rating, comment } = req.body || {};
    if (!req.user?._id || String(req.user._id) !== String(userId)) {
      return res.status(403).json({ message: "You can only submit a review for your own account." });
    }
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "A valid user and product are required." });
    }
    if (!Number.isFinite(Number(rating)) || Number(rating) < 1 || Number(rating) > 5 || !String(comment || "").trim()) {
      return res.status(400).json({ message: "A rating from 1 to 5 and review text are required." });
    }

    const [user, product] = await Promise.all([
      User.findById(userId),
      Products.findById(productId),
    ]);
    if (!user || !product) return res.status(404).json({ message: "User or product not found." });

    const existingReview = await Review.findOne({ userId, productId, source: "website" });
    if (existingReview) {
      return res.status(400).json({ message: "You have already left a review for this product." });
    }
    const checkPurchase = await Order.findOne({
      user: new mongoose.Types.ObjectId(userId),
      status: "delivered",
      "cart._id": { $in: [productId] },
    });
    if (!checkPurchase) {
      return res.status(400).json({ message: "Without purchase you can not give here review!" });
    }

    const review = await Review.create({
      userId,
      productId,
      displayName: user.name,
      rating: Number(rating),
      comment: String(comment).trim(),
      source: "website",
      isPublished: true,
      verifiedPurchase: true,
    });
    await Promise.all([
      Products.updateOne({ _id: productId }, { $addToSet: { reviews: review._id } }),
      User.updateOne({ _id: userId }, { $addToSet: { reviews: review._id } }),
    ]);
    return res.status(201).json({ message: "Review added successfully." });
  } catch (error) {
    next(error);
  }
};

const reviewInput = (body = {}, existing = {}) => {
  const displayName = String(body.displayName ?? existing.displayName ?? existing.userId?.name ?? "").trim();
  const comment = String(body.comment ?? existing.comment ?? "").trim();
  const productId = body.productId ?? existing.productId;
  if (!displayName || displayName.length > 120) throw Object.assign(new Error("Customer name is required and must be 120 characters or fewer."), { statusCode: 400 });
  if (!comment || comment.length > 5000) throw Object.assign(new Error("Review text is required and must be 5,000 characters or fewer."), { statusCode: 400 });
  if (!mongoose.isValidObjectId(productId)) throw Object.assign(new Error("Select a valid product."), { statusCode: 400 });

  const input = { displayName, comment, productId };
  const rating = body.rating === "" || body.rating === null ? undefined : body.rating;
  if (rating !== undefined || (existing.rating !== undefined && !Object.prototype.hasOwnProperty.call(body, "rating"))) {
    const value = Number(rating !== undefined ? rating : existing.rating);
    if (!Number.isFinite(value) || value < 1 || value > 5) throw Object.assign(new Error("Rating must be between 1 and 5."), { statusCode: 400 });
    input.rating = value;
  } else {
    input.rating = undefined;
  }
  if (Object.prototype.hasOwnProperty.call(body, "reviewDate")) {
    if (body.reviewDate) {
      const date = new Date(body.reviewDate);
      if (Number.isNaN(date.getTime())) throw Object.assign(new Error("Enter a valid review date."), { statusCode: 400 });
      input.reviewDate = date;
    } else input.reviewDate = undefined;
  } else if (existing.reviewDate) input.reviewDate = existing.reviewDate;
  return input;
};

exports.adminListReviews = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.productId && mongoose.isValidObjectId(req.query.productId)) filter.productId = req.query.productId;
    if (["manual", "website"].includes(req.query.source)) filter.source = req.query.source;
    if (req.query.published === "true") filter.$or = [{ isPublished: true }, { isPublished: { $exists: false } }];
    if (req.query.published === "false") filter.isPublished = false;
    const reviews = await Review.find(filter).populate("productId", "title").populate("userId", "name").sort({ createdAt: -1 }).lean();
    reviews.forEach((review) => {
      if (!review.source) review.source = "website";
      if (typeof review.isPublished !== "boolean") review.isPublished = true;
      review.verifiedPurchase = review.verifiedPurchase === true;
    });
    res.json({ data: reviews });
  } catch (error) { next(error); }
};

exports.adminCreateReview = async (req, res, next) => {
  try {
    const input = reviewInput(req.body);
    const product = await Products.findById(input.productId).select("_id");
    if (!product) return res.status(404).json({ message: "Product not found." });
    const review = await Review.create({
      ...input,
      source: "manual",
      isPublished: req.body.isPublished === true,
      verifiedPurchase: false,
    });
    await Products.updateOne({ _id: product._id }, { $addToSet: { reviews: review._id } });
    res.status(201).json({ message: "Review created successfully.", data: review });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    next(error);
  }
};

exports.adminImportReviews = async (req, res, next) => {
  try {
    const rows = req.body?.reviews;
    if (!Array.isArray(rows) || rows.length === 0 || rows.length > 500) {
      return res.status(400).json({ message: "Upload between 1 and 500 review rows." });
    }

    const validRows = [];
    const rowErrors = [];
    for (const [index, row] of rows.entries()) {
      try {
        const input = reviewInput(row);
        validRows.push({ rowNumber: index + 2, data: {
          ...input,
          source: "manual",
          isPublished: row.isPublished === true,
          verifiedPurchase: false,
        } });
      } catch (error) {
        rowErrors.push({ row: index + 2, message: error.message });
      }
    }

    const productIds = [...new Set(validRows.map(({ data }) => String(data.productId)))];
    const existingProducts = await Products.find({ _id: { $in: productIds } }).select("_id").lean();
    const existingProductIds = new Set(existingProducts.map((product) => String(product._id)));
    const rowsToCreate = validRows.filter(({ data }) => existingProductIds.has(String(data.productId))).map(({ data }) => data);
    validRows.forEach(({ rowNumber, data }) => {
      if (!existingProductIds.has(String(data.productId))) {
        rowErrors.push({ row: rowNumber, message: "Product not found." });
      }
    });
    if (rowsToCreate.length === 0) {
      return res.status(400).json({ message: "No valid reviews to import.", imported: 0, errors: rowErrors });
    }

    const createdReviews = await Review.insertMany(rowsToCreate, { ordered: false });
    const reviewIdsByProduct = new Map();
    createdReviews.forEach((review) => {
      const productId = String(review.productId);
      reviewIdsByProduct.set(productId, [...(reviewIdsByProduct.get(productId) || []), review._id]);
    });
    await Products.bulkWrite([...reviewIdsByProduct.entries()].map(([productId, reviewIds]) => ({
      updateOne: { filter: { _id: productId }, update: { $addToSet: { reviews: { $each: reviewIds } } } },
    })));

    res.status(201).json({
      message: `Imported ${createdReviews.length} review${createdReviews.length === 1 ? "" : "s"}.`,
      imported: createdReviews.length,
      errors: rowErrors,
    });
  } catch (error) {
    next(error);
  }
};

exports.adminUpdateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate("userId", "name");
    if (!review) return res.status(404).json({ message: "Review not found." });
    const input = reviewInput(req.body, review);
    const product = await Products.findById(input.productId).select("_id");
    if (!product) return res.status(404).json({ message: "Product not found." });
    const previousProductId = String(review.productId);
    Object.assign(review, input);
    if (typeof req.body.isPublished === "boolean") review.isPublished = req.body.isPublished;
    await review.save();
    if (previousProductId !== String(product._id)) {
      await Promise.all([
        Products.updateOne({ _id: previousProductId }, { $pull: { reviews: review._id } }),
        Products.updateOne({ _id: product._id }, { $addToSet: { reviews: review._id } }),
      ]);
    }
    res.json({ message: "Review updated successfully.", data: review });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    next(error);
  }
};

exports.adminDeleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found." });
    await Products.updateOne({ _id: review.productId }, { $pull: { reviews: review._id } });
    if (review.userId) await User.updateOne({ _id: review.userId }, { $pull: { reviews: review._id } });
    res.json({ message: "Review deleted successfully." });
  } catch (error) { next(error); }
};
