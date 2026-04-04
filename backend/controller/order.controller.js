const { secret } = require("../config/secret");
const https = require("https");
const Order = require("../model/Order");
const Settings = require("../model/Settings");
const { transporter } = require("../config/email");

const getActivePaystackSecretKey = async () => {
  const settings = await Settings.getSettings();
  const paystackMode = settings?.paystackMode === "live" ? "live" : "test";
  const configuredKey =
    paystackMode === "live"
      ? settings?.paystackLiveApiKey
      : settings?.paystackTestApiKey;

  return configuredKey || secret.paystack_secret_key || "";
};

// initialize-payment (Paystack)
exports.initializePayment = async (req, res, next) => {
  try {
    console.log("Initialize payment request received:", req.body);
    const { email, amount, reference, metadata } = req.body;
    
    if (!email || !amount || !reference) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: email, amount, or reference",
      });
    }
    
    const activePaystackSecretKey = await getActivePaystackSecretKey();
    if (!activePaystackSecretKey) {
      console.error("Paystack secret key is not configured");
      return res.status(500).json({
        success: false,
        message: "Payment gateway not configured",
      });
    }
    
    // Convert amount to kobo (Paystack uses kobo as the smallest currency unit)
    const amountInKobo = Math.round(Number(amount) * 100);
    
    // Payment channels configuration
    // In test mode, Paystack only shows Card and USSD
    // In live mode, all available channels are shown: card, bank, ussd, qr, mobile_money, bank_transfer
    // You can optionally restrict channels by uncommenting and specifying the channels array
    const paymentParams = {
      email: email,
      amount: amountInKobo,
      reference: reference,
      currency: "NGN",
      metadata: metadata || {},
      callback_url: `${secret.client_url}/order/verify-payment?reference=${reference}`,
      // Uncomment below to enable specific payment channels (optional)
      // channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
    };
    
    const params = JSON.stringify(paymentParams);

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/transaction/initialize",
      method: "POST",
      headers: {
        Authorization: `Bearer ${activePaystackSecretKey}`,
        "Content-Type": "application/json",
      },
    };

    const paystackRequest = https.request(options, (paystackResponse) => {
      let data = "";

      paystackResponse.on("data", (chunk) => {
        data += chunk;
      });

      paystackResponse.on("end", () => {
        try {
          const response = JSON.parse(data);
          
          if (res.headersSent) {
            console.error("Response already sent, cannot send again");
            return;
          }
          
          if (response.status) {
            res.status(200).json({
              success: true,
              data: {
                authorization_url: response.data.authorization_url,
                access_code: response.data.access_code,
                reference: response.data.reference,
              },
            });
          } else {
            res.status(400).json({
              success: false,
              message: response.message || "Payment initialization failed",
            });
          }
        } catch (parseError) {
          console.error("Error parsing Paystack response:", parseError);
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              message: "Error processing payment response",
            });
          }
        }
      });
    });

    paystackRequest.on("error", (error) => {
      console.error("Paystack API Error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Error initializing payment",
        });
      }
    });

    paystackRequest.write(params);
    paystackRequest.end();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// verify-payment (Paystack)
exports.verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.body;
    
    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required",
      });
    }
    
    const activePaystackSecretKey = await getActivePaystackSecretKey();
    if (!activePaystackSecretKey) {
      console.error("Paystack secret key is not configured");
      return res.status(500).json({
        success: false,
        message: "Payment gateway not configured",
      });
    }
    
    console.log("Verifying payment with reference:", reference);

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${activePaystackSecretKey}`,
      },
    };

    const paystackRequest = https.request(options, (paystackResponse) => {
      let data = "";

      paystackResponse.on("data", (chunk) => {
        data += chunk;
      });

      paystackResponse.on("end", () => {
        try {
          const response = JSON.parse(data);
          console.log("Paystack verification response:", {
            status: response.status,
            dataStatus: response.data?.status,
            message: response.message,
          });
          
          if (res.headersSent) {
            console.error("Response already sent, cannot send again");
            return;
          }
          
          if (response.status && response.data && response.data.status === "success") {
            res.status(200).json({
              success: true,
              data: {
                status: response.data.status,
                reference: response.data.reference,
                amount: response.data.amount / 100, // Convert from kobo to naira
                customer: response.data.customer,
                metadata: response.data.metadata || {},
              },
            });
          } else {
            console.error("Payment verification failed:", response.message || "Unknown error");
            res.status(400).json({
              success: false,
              message: response.message || "Payment verification failed",
              paystackResponse: response,
            });
          }
        } catch (parseError) {
          console.error("Error parsing Paystack response:", parseError);
          console.error("Raw response data:", data);
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              message: "Error processing payment response",
            });
          }
        }
      });
    });

    paystackRequest.on("error", (error) => {
      console.error("Paystack API Error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Error verifying payment",
          error: error.message,
        });
      }
    });

    paystackRequest.end();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// addOrder
exports.addOrder = async (req, res, next) => {
  try {
    const orderItems = await Order.create(req.body);

    // Send email confirmation
    const allPreOrder = req.body.cart.every(item => item.isPreOrder === true);
    if (allPreOrder) {
      const launchDate = req.body.cart[0]?.launchDate;
      const mailData = {
        from: secret.email_user,
        to: req.body.email,
        subject: "Your Pre-Order is Confirmed",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #ff5501; text-align: center;">Your Pre-Order is Confirmed 🎉</h2>
            <p>Hi <strong>${req.body.name}</strong>,</p>
            <p>Your pre-order has been successfully confirmed. We're excited to get your items to you!</p>
            <div style="background-color: #fff4f0; padding: 15px; border-radius: 8px; border-left: 4px solid #ff5501; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: #ff5501;">Delivery Schedule</p>
              <p style="margin: 5px 0 0 0; color: #333;">Your items will be shipped starting <strong>${new Date(launchDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} (Launch Day)</strong>.</p>
            </div>
            <p>We’ll keep you informed as we get closer to delivery. You'll receive another email once your order has been shipped.</p>
            <p>Thank you for choosing <strong>Hracine</strong>.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">
              <p>© 2026 Hracine. All rights reserved.</p>
            </div>
          </div>
        `,
      };
      
      transporter.sendMail(mailData, (err, info) => {
        if (err) {
          console.error("Error sending pre-order email:", err);
        } else {
          console.log("Pre-order email sent successfully");
        }
      });
    }

    res.status(200).json({
      success: true,
      message: "Order added successfully",
      order: orderItems,
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
// get Orders
exports.getOrders = async (req, res, next) => {
  try {
    const orderItems = await Order.find({}).populate('user');
    res.status(200).json({
      success: true,
      data: orderItems,
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
// get Orders
exports.getSingleOrder = async (req, res, next) => {
  try {
    const orderItem = await Order.findById(req.params.id).populate('user');
    res.status(200).json(orderItem);
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};

exports.updateOrderStatus = async (req, res) => {
  const newStatus = req.body.status;
  try {
    await Order.updateOne(
      {
        _id: req.params.id,
      },
      {
        $set: {
          status: newStatus,
        },
      }, { new: true })
    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
