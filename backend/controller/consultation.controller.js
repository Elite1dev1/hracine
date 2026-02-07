const Consultation = require("../model/Consultation");

// Create consultation
exports.createConsultation = async (req, res, next) => {
  try {
    const { name, email, phone, biggestConcern, protectiveStyle, preferredDate, preferredTime, notes } = req.body;

    if (!name || !email || !biggestConcern || !protectiveStyle || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const consultation = await Consultation.create({
      name,
      email,
      phone: phone || "",
      biggestConcern,
      protectiveStyle,
      preferredDate,
      preferredTime,
      notes: notes || "",
    });

    res.status(201).json({
      success: true,
      message: "Consultation booked successfully",
      data: consultation,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Get all consultations (Admin only)
exports.getAllConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations,
    });
  } catch (error) {
    next(error);
  }
};

// Get single consultation (Admin only)
exports.getConsultation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findById(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

// Update consultation status (Admin only)
exports.updateConsultationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid status",
      });
    }

    const consultation = await Consultation.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Consultation status updated successfully",
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

// Delete consultation (Admin only)
exports.deleteConsultation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findByIdAndDelete(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Consultation deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

