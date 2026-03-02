const Newsletter = require("../model/Newsletter");

// Subscribe to newsletter
exports.subscribe = async (req, res, next) => {
  try {
  const { email, source = "modal" } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  // Check if email already exists
  const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });

  if (existingSubscriber) {
    // If already exists but unsubscribed, reactivate
    if (existingSubscriber.status === "unsubscribed") {
      existingSubscriber.status = "active";
      existingSubscriber.subscribed_at = new Date();
      await existingSubscriber.save();
      
      return res.status(200).json({
        success: true,
        message: "You're already part of the tribe 👑",
        data: existingSubscriber,
      });
    }

    return res.status(200).json({
      success: true,
      message: "You're already part of the tribe 👑",
      data: existingSubscriber,
    });
  }

  // Create new subscriber
  const subscriber = await Newsletter.create({
    email: email.toLowerCase(),
    source,
    status: "active",
    subscribed_at: new Date(),
  });

  res.status(201).json({
    success: true,
    message: "You're officially part of the Root Tribe 💚",
    data: subscriber,
  });
  } catch (error) {
    next(error);
  }
};

// Get all subscribers (Admin)
exports.getAllSubscribers = async (req, res, next) => {
  try {
  const { search, status, startDate, endDate, page = 1, limit = 50 } = req.query;

  const query = {};

  // Search by email
  if (search) {
    query.email = { $regex: search, $options: "i" };
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by date range
  if (startDate || endDate) {
    query.subscribed_at = {};
    if (startDate) {
      query.subscribed_at.$gte = new Date(startDate);
    }
    if (endDate) {
      query.subscribed_at.$lte = new Date(endDate);
    }
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const subscribers = await Newsletter.find(query)
    .sort({ subscribed_at: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Newsletter.countDocuments(query);

  res.status(200).json({
    success: true,
    data: subscribers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
  } catch (error) {
    next(error);
  }
};

// Export subscribers to CSV
exports.exportSubscribers = async (req, res, next) => {
  try {
  const { search, status, startDate, endDate } = req.query;

  const query = {};

  if (search) {
    query.email = { $regex: search, $options: "i" };
  }

  if (status) {
    query.status = status;
  }

  if (startDate || endDate) {
    query.subscribed_at = {};
    if (startDate) {
      query.subscribed_at.$gte = new Date(startDate);
    }
    if (endDate) {
      query.subscribed_at.$lte = new Date(endDate);
    }
  }

  const subscribers = await Newsletter.find(query).sort({ subscribed_at: -1 });

  // Generate CSV
  const csvHeader = "email,source,subscribed_at,status\n";
  const csvRows = subscribers.map((sub) => {
    return `${sub.email},${sub.source},${sub.subscribed_at.toISOString()},${sub.status}`;
  });

  const csv = csvHeader + csvRows.join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=newsletter-subscribers-${Date.now()}.csv`);
  res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

// Unsubscribe
exports.unsubscribe = async (req, res, next) => {
  try {
  const { email } = req.body;

  const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

  if (!subscriber) {
    return res.status(404).json({
      success: false,
      message: "Email not found",
    });
  }

  subscriber.status = "unsubscribed";
  await subscriber.save();

  res.status(200).json({
    success: true,
    message: "Successfully unsubscribed",
  });
  } catch (error) {
    next(error);
  }
};

// Get subscriber stats (Admin)
exports.getStats = async (req, res, next) => {
  try {
  const total = await Newsletter.countDocuments();
  const active = await Newsletter.countDocuments({ status: "active" });
  const unsubscribed = await Newsletter.countDocuments({ status: "unsubscribed" });
  const today = await Newsletter.countDocuments({
    subscribed_at: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
    },
  });

  res.status(200).json({
    success: true,
    data: {
      total,
      active,
      unsubscribed,
      today,
    },
  });
  } catch (error) {
    next(error);
  }
};
