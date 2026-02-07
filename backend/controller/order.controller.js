const { secret } = require("../config/secret");
const https = require("https");
const Order = require("../model/Order");

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
    
    if (!secret.paystack_secret_key) {
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
        Authorization: `Bearer ${secret.paystack_secret_key}`,
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
    
    if (!secret.paystack_secret_key) {
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
        Authorization: `Bearer ${secret.paystack_secret_key}`,
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
