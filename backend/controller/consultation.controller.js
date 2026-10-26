const crypto = require("crypto");
const https = require("https");
const Consultation = require("../model/Consultation");
const Settings = require("../model/Settings");
const { secret } = require("../config/secret");
const { escapeHtml, sendAdminNotification } = require("../utils/admin-notifications");

const notifyConsultationAdmins = async (consultation) => {
  try {
    const claimed = await Consultation.findOneAndUpdate(
      {
        _id: consultation._id,
        adminNotificationStatus: { $in: ["pending", "failed"] },
      },
      { $set: { adminNotificationStatus: "sending" } },
      { new: true }
    );
    if (!claimed) return;

    const adminUrl = secret.admin_url
      ? `${String(secret.admin_url).replace(/\/$/, "")}/consultations`
      : "";
    const sent = await sendAdminNotification({
      subject: `New paid HRACINE consultation — ${claimed.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#282323;line-height:1.6;max-width:600px">
          <h2 style="color:#702a27">New consultation booked</h2>
          <p><strong>Payment:</strong> Successfully verified</p>
          <p><strong>Fee:</strong> ₦${Number(claimed.amountPaid || claimed.amountDue || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
          <p><strong>Name:</strong> ${escapeHtml(claimed.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(claimed.email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(claimed.phone || "Not provided")}</p>
          <p><strong>Concern:</strong> ${escapeHtml(claimed.biggestConcern)}</p>
          <p><strong>Protective style:</strong> ${escapeHtml(claimed.protectiveStyle)}</p>
          <p><strong>Preferred date:</strong> ${claimed.preferredDate ? new Date(claimed.preferredDate).toLocaleDateString("en-GB") : "Not provided"}</p>
          <p><strong>Preferred time:</strong> ${escapeHtml(claimed.preferredTime)}</p>
          ${adminUrl ? `<p><a href="${escapeHtml(adminUrl)}">View consultations in admin</a></p>` : ""}
        </div>
      `,
    });

    await Consultation.updateOne(
      { _id: claimed._id, adminNotificationStatus: "sending" },
      {
        $set: {
          adminNotificationStatus: sent ? "sent" : "failed",
          adminNotificationSentAt: sent ? new Date() : null,
        },
      }
    );
  } catch (error) {
    console.error("Consultation admin notification failed:", error.message);
  }
};

const getActivePaystackSecretKey = async () => {
  const settings = await Settings.getSettings();
  const paystackMode = settings?.paystackMode === "live" ? "live" : "test";
  const configuredKey =
    paystackMode === "live"
      ? settings?.paystackLiveApiKey
      : settings?.paystackTestApiKey;

  return configuredKey || secret.paystack_secret_key || "";
};

const paystackRequest = ({ method, path, apiKey, payload }) =>
  new Promise((resolve, reject) => {
    const requestBody = payload ? JSON.stringify(payload) : null;
    const request = https.request(
      {
        hostname: "api.paystack.co",
        port: 443,
        path,
        method,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          ...(requestBody
            ? {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestBody),
              }
            : {}),
        },
      },
      (response) => {
        let responseBody = "";
        response.on("data", (chunk) => {
          responseBody += chunk;
        });
        response.on("end", () => {
          try {
            resolve(JSON.parse(responseBody));
          } catch (error) {
            reject(new Error("Paystack returned an invalid response"));
          }
        });
      }
    );

    request.on("error", reject);
    if (requestBody) request.write(requestBody);
    request.end();
  });

const getBookingFields = (body = {}) => ({
  name: String(body.name || "").trim(),
  email: String(body.email || "").trim().toLowerCase(),
  phone: String(body.phone || "").trim(),
  biggestConcern: String(body.biggestConcern || "").trim(),
  protectiveStyle: String(body.protectiveStyle || "").trim(),
  preferredDate: body.preferredDate,
  preferredTime: String(body.preferredTime || "").trim(),
  notes: String(body.notes || "").trim(),
});

const hasRequiredBookingFields = (booking) =>
  booking.name &&
  booking.email &&
  booking.biggestConcern &&
  booking.protectiveStyle &&
  booking.preferredDate &&
  booking.preferredTime;

// Start a Root Check payment using the fee stored in admin settings.
exports.initializeRootCheckPayment = async (req, res, next) => {
  let consultation;

  try {
    const booking = getBookingFields(req.body);
    if (!hasRequiredBookingFields(booking)) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required booking fields",
      });
    }

    const settings = await Settings.getSettings();
    const rootCheckFee = Number(settings.rootCheckFee);
    if (!Number.isFinite(rootCheckFee) || rootCheckFee <= 0) {
      return res.status(500).json({
        success: false,
        message: "The Root Check fee is not configured correctly",
      });
    }

    const apiKey = await getActivePaystackSecretKey();
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "Payment gateway not configured",
      });
    }

    const paymentReference = `ROOTCHECK_${Date.now()}_${crypto
      .randomBytes(5)
      .toString("hex")}`;

    consultation = await Consultation.create({
      ...booking,
      paymentStatus: "pending",
      paymentReference,
      amountDue: rootCheckFee,
    });

    const clientUrl = String(secret.client_url || "").replace(/\/$/, "");
    if (!clientUrl) {
      await Consultation.findByIdAndDelete(consultation._id);
      return res.status(500).json({
        success: false,
        message: "Client URL is not configured",
      });
    }

    const paystackResponse = await paystackRequest({
      method: "POST",
      path: "/transaction/initialize",
      apiKey,
      payload: {
        email: booking.email,
        amount: Math.round(rootCheckFee * 100),
        reference: paymentReference,
        currency: "NGN",
        callback_url: `${clientUrl}/consultation/verify-payment?reference=${paymentReference}`,
        metadata: {
          payment_type: "root_check",
          consultation_id: consultation._id.toString(),
          customer_name: booking.name,
        },
      },
    });

    if (!paystackResponse.status || !paystackResponse.data?.authorization_url) {
      await Consultation.findByIdAndDelete(consultation._id);
      return res.status(400).json({
        success: false,
        message: paystackResponse.message || "Payment initialization failed",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        authorization_url: paystackResponse.data.authorization_url,
        access_code: paystackResponse.data.access_code,
        reference: paymentReference,
      },
    });
  } catch (error) {
    if (consultation?._id) {
      await Consultation.findByIdAndDelete(consultation._id).catch(() => {});
    }
    next(error);
  }
};

// Verify the Paystack transaction and confirm the Root Check booking.
exports.verifyRootCheckPayment = async (req, res, next) => {
  try {
    const reference = String(req.body?.reference || "").trim();
    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required",
      });
    }

    const consultation = await Consultation.findOne({ paymentReference: reference });
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Root Check payment could not be found",
      });
    }

    if (consultation.paymentStatus === "paid") {
      await notifyConsultationAdmins(consultation);
      return res.status(200).json({
        success: true,
        message: "Root Check payment already verified",
        data: consultation,
      });
    }

    const apiKey = await getActivePaystackSecretKey();
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "Payment gateway not configured",
      });
    }

    const paystackResponse = await paystackRequest({
      method: "GET",
      path: `/transaction/verify/${encodeURIComponent(reference)}`,
      apiKey,
    });
    const transaction = paystackResponse.data;
    const expectedAmount = Math.round(Number(consultation.amountDue) * 100);
    const paidEmail = String(transaction?.customer?.email || "").toLowerCase();

    const isValidPayment =
      paystackResponse.status === true &&
      transaction?.status === "success" &&
      transaction?.reference === reference &&
      transaction?.currency === "NGN" &&
      Number(transaction?.amount) === expectedAmount &&
      paidEmail === consultation.email;

    if (!isValidPayment) {
      consultation.paymentStatus = "failed";
      await consultation.save();
      return res.status(400).json({
        success: false,
        message: "Payment could not be verified for this Root Check booking",
      });
    }

    consultation.paymentStatus = "paid";
    consultation.paymentId = String(transaction.id || "");
    consultation.amountPaid = Number(transaction.amount) / 100;
    consultation.paidAt = transaction.paid_at
      ? new Date(transaction.paid_at)
      : new Date();
    await consultation.save();
    await notifyConsultationAdmins(consultation);

    return res.status(200).json({
      success: true,
      message: "Payment successful. Your Root Check is booked.",
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

// Direct unpaid booking creation is no longer allowed.
exports.createConsultation = async (req, res) => {
  res.status(402).json({
    success: false,
    message: "Payment is required before a Root Check can be booked",
  });
};

exports.getAllConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation.find({
      $or: [
        { paymentStatus: "paid" },
        { paymentStatus: { $exists: false } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations,
    });
  } catch (error) {
    next(error);
  }
};

exports.getConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Root Check booking not found",
      });
    }

    res.status(200).json({ success: true, data: consultation });
  } catch (error) {
    next(error);
  }
};

exports.updateConsultationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid status",
      });
    }

    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Root Check booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Root Check status updated successfully",
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findByIdAndDelete(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Root Check booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Root Check booking deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
