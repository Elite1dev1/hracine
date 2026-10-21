const Brand = require("../model/Brand");
const Category = require("../model/Category");
const Product = require("../model/Products");

const hasValidSortOrder = (product) =>
  Number.isInteger(product?.sortOrder) && product.sortOrder > 0;

// MongoDB does not guarantee natural query order. This comparator also gives
// legacy products without sortOrder a deterministic position until an admin
// saves an order (or a new product triggers the automatic backfill).
const sortProductsByDisplayOrder = (products) => products.sort((a, b) => {
  const aHasOrder = hasValidSortOrder(a);
  const bHasOrder = hasValidSortOrder(b);

  if (aHasOrder && bHasOrder && a.sortOrder !== b.sortOrder) {
    return a.sortOrder - b.sortOrder;
  }
  if (aHasOrder !== bHasOrder) {
    return aHasOrder ? -1 : 1;
  }

  const createdDifference = new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
  if (createdDifference !== 0) return createdDifference;
  return String(a._id).localeCompare(String(b._id));
});

const ensureDisplayOrder = async () => {
  const products = await Product.find({}).select("_id sortOrder createdAt").lean();
  if (products.every(hasValidSortOrder)) {
    return products.reduce((max, product) => Math.max(max, product.sortOrder), 0);
  }

  const orderedProducts = sortProductsByDisplayOrder(products);
  const operations = orderedProducts.map((product, index) => ({
    updateOne: {
      filter: { _id: product._id },
      update: { $set: { sortOrder: index + 1 } },
    },
  }));

  if (operations.length > 0) {
    await Product.bulkWrite(operations, { ordered: true });
  }
  return orderedProducts.length;
};

// create product service
exports.createProductService = async (data) => {
  const lastPosition = await ensureDisplayOrder();
  const product = await Product.create({
    ...data,
    sortOrder: lastPosition + 1,
  });
  const { _id: productId, brand, category } = product;
  //update Brand
  await Brand.updateOne(
    { _id: brand.id },
    { $push: { products: productId } }
  );
  //Category Brand
  await Category.updateOne(
    { _id: category.id },
    { $push: { products: productId } }
  );
  return product;
};

// create all product service
exports.addAllProductService = async (data) => {
  await Product.deleteMany();
  const products = await Product.insertMany(
    data.map((product, index) => ({ ...product, sortOrder: index + 1 }))
  );
  for (const product of products) {
    await Brand.findByIdAndUpdate(product.brand.id, {
      $push: { products: product._id },
    });
    await Category.findByIdAndUpdate(product.category.id, {
      $push: { products: product._id },
    });
  }
  return products;
};

// get product data
exports.getAllProductsService = async () => {
  const products = await Product.find({}).populate("reviews");
  return sortProductsByDisplayOrder(products);
};

// get type of product service
exports.getProductTypeService = async (req) => {
  const type = req.params.type;
  const query = req.query;
  let products;
  
  // Handle special 'all' type or queries that should return all product types
  const shouldQueryAllTypes = type === 'all' || query.new === "true" || query.comingSoon === "true";
  
  if (query.new === "true") {
    // Get newest products from ALL product types
    products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("reviews");
  } else if (query.comingSoon === "true") {
    // Get products marked as free shipping on orders above #25,000 from ALL product types
    products = await Product.find({
      comingSoon: true,
    }).populate("reviews");
    sortProductsByDisplayOrder(products);
    
    // Fallback to the first products in the configured storefront order.
    if (products.length === 0) {
      const allProducts = await Product.find({}).populate("reviews");
      products = sortProductsByDisplayOrder(allProducts).slice(0, 4);
    }
  } else if (query.featured === "true") {
    if (shouldQueryAllTypes) {
      // Get featured products from ALL product types
      products = await Product.find({
        featured: true,
      }).populate("reviews");
    } else {
      products = await Product.find({
        productType: type,
        featured: true,
      }).populate("reviews");
    }
    sortProductsByDisplayOrder(products);
  } else if (query.topSellers === "true") {
    if (shouldQueryAllTypes) {
      products = await Product.find({})
        .sort({ sellCount: -1 })
        .limit(8)
        .populate("reviews");
    } else {
      products = await Product.find({ productType: type })
        .sort({ sellCount: -1 })
        .limit(8)
        .populate("reviews");
    }
  } else {
    if (shouldQueryAllTypes) {
      products = await Product.find({}).populate("reviews");
    } else {
      products = await Product.find({ productType: type }).populate("reviews");
    }
    sortProductsByDisplayOrder(products);
  }
  return products;
};

// get offer product service
exports.getOfferTimerProductService = async (query) => {
  const products = await Product.find({
    productType: query,
    "offerDate.endDate": { $gt: new Date() },
  }).populate("reviews");
  return sortProductsByDisplayOrder(products);
};

// get popular product service by type
exports.getPopularProductServiceByType = async (type) => {
  const products = await Product.find({ productType: type })
    .sort({ "reviews.length": -1 })
    .limit(8)
    .populate("reviews");
  return products;
};

exports.getTopRatedProductService = async () => {
  const products = await Product.find({
    reviews: { $exists: true, $ne: [] },
  }).populate("reviews");

  const topRatedProducts = products.map((product) => {
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRating / product.reviews.length;

    return {
      ...product.toObject(),
      rating: averageRating,
    };
  });

  topRatedProducts.sort((a, b) => b.rating - a.rating);

  return topRatedProducts;
};


// File path: services/productService.js

/**
 * Get product data along with populated reviews and user details
 * @param {string} id - The ID of the product to retrieve
 * @returns {Object|null} - Returns the product object if found, otherwise null
 * @throws {Error} - Throws an error if the operation fails
 */
exports.getProductService = async (id) => {
  if (!id) {
    console.error("Product ID is required");
    throw new Error("Product ID is required");
  }

  try {
    const product = await Product.findById(id).populate({
      path: "reviews",
      populate: { path: "userId", select: "name email imageURL" },
    });
    console.log(product);
    if (!product) {
      console.warn(`Product not found for ID: ${id}`);
      return null;  // Return null if product is not found
    }

    console.log(`Product found: ${JSON.stringify(product, null, 2)}`);
    return product;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error.message);
    throw new Error("Error fetching product data");
  }
};



// get product data
exports.getRelatedProductService = async (productId) => {
  const currentProduct = await Product.findById(productId);

  const relatedProducts = await Product.find({
    "category.name": currentProduct.category.name,
    _id: { $ne: productId }, // Exclude the current product ID
  });
  return sortProductsByDisplayOrder(relatedProducts);
};

exports.reorderProductsService = async (orderedIds) => {
  const products = await Product.find({}).select("_id").lean();
  const existingIds = new Set(products.map((product) => String(product._id)));

  if (
    orderedIds.length !== existingIds.size ||
    orderedIds.some((id) => !existingIds.has(String(id)))
  ) {
    const error = new Error("The product list changed. Refresh the page and try again.");
    error.statusCode = 409;
    throw error;
  }

  await Product.bulkWrite(
    orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { sortOrder: index + 1 } },
      },
    })),
    { ordered: true }
  );

  return orderedIds.length;
};

exports.sortProductsByDisplayOrder = sortProductsByDisplayOrder;

// update a product
exports.updateProductService = async (id, currProduct) => {

  const product = await Product.findById(id);
  if (product) {
    product.title = currProduct.title;
    product.brand.name = currProduct.brand.name;
    product.brand.id = currProduct.brand.id;
    product.category.name = currProduct.category.name;
    product.category.id = currProduct.category.id;
    product.sku = currProduct.sku;
    product.img = currProduct.img;
    product.slug = currProduct.slug;
    product.unit = currProduct.unit;
    product.imageURLs = currProduct.imageURLs;
    product.tags = currProduct.tags;
    product.parent = currProduct.parent;
    product.children = currProduct.children;
    product.price = currProduct.price;
    product.discount = currProduct.discount;
    product.quantity = currProduct.quantity;
    product.status = currProduct.status;
    product.productType = currProduct.productType;
    product.description = currProduct.description;
    product.additionalInformation = currProduct.additionalInformation;
    
    // Handle offerDate safely
    if (currProduct.offerDate) {
      if (currProduct.offerDate.startDate !== undefined) {
        product.offerDate.startDate = currProduct.offerDate.startDate;
      }
      if (currProduct.offerDate.endDate !== undefined) {
        product.offerDate.endDate = currProduct.offerDate.endDate;
      }
    }
    
    // Update new hair care fields
    if (currProduct.ingredients !== undefined) {
      product.ingredients = currProduct.ingredients;
    }
    if (currProduct.howToUse !== undefined) {
      product.howToUse = currProduct.howToUse;
    }
    if (currProduct.keyBenefits !== undefined) {
      product.keyBenefits = Array.isArray(currProduct.keyBenefits) ? currProduct.keyBenefits : [];
    }
    if (currProduct.comingSoon !== undefined) {
      product.comingSoon = currProduct.comingSoon;
    }
    if (currProduct.featured !== undefined) {
      product.featured = currProduct.featured;
    }
    if (currProduct.isPreOrder !== undefined) {
      product.isPreOrder = currProduct.isPreOrder;
    }
    if (currProduct.launchDate !== undefined) {
      product.launchDate = currProduct.launchDate;
    }

    await product.save();
  }

  return product;
};



// get Reviews Products
exports.getReviewsProducts = async () => {
  const result = await Product.find({
    reviews: { $exists: true, $ne: [] },
  })
    .populate({
      path: "reviews",
      populate: { path: "userId", select: "name email imageURL" },
    });

  const products = result.filter(p => p.reviews.length > 0)

  return sortProductsByDisplayOrder(products);
};

// get Reviews Products
exports.getStockOutProducts = async () => {
  const result = await Product.find({ status: "out-of-stock" }).sort({ createdAt: -1 })
  return result;
};

// get Reviews Products
exports.deleteProduct = async (id) => {
  const result = await Product.findByIdAndDelete(id)
  return result;
};
