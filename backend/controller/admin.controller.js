const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const jwt = require('jsonwebtoken');
const { tokenForVerify } = require("../config/auth");
const Admin = require("../model/Admin");
const { generateToken } = require("../utils/token");
const { sendEmail } = require("../config/email");
const { secret } = require("../config/secret");

// register
const registerAdmin = async (req, res,next) => {
  try {
    const isAdded = await Admin.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(403).send({
        message: "This Email already Added!",
      });
    } else {
      const newStaff = new Admin({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: bcrypt.hashSync(req.body.password),
      });
      const staff = await newStaff.save();
      const token = generateToken(staff);
      res.status(200).send({
        token,
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        joiningData: Date.now(),
      });
    }
  } catch (err) {
    next(err)
  }
};
// login admin
const loginAdmin = async (req, res,next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        status: "fail",
        message: "Email and password are required",
      });
    }

    const email = req.body.email.toLowerCase().trim();
    const password = req.body.password;
    
    console.log('Login attempt for email:', email);
    
    const admin = await Admin.findOne({ email: email });
    
    if (!admin) {
      console.log('Admin not found for email:', email);
      return res.status(401).json({
        status: "fail",
        message: "Invalid Email or password!",
      });
    }

    console.log('Admin found:', admin.email, 'Status:', admin.status);

    if (admin.status === "Inactive") {
      return res.status(403).json({
        status: "fail",
        message: "Your account is inactive. Please contact administrator.",
      });
    }
    
    // Check if password exists and is valid
    if (!admin.password) {
      console.log('Admin has no password set');
      return res.status(401).json({
        status: "fail",
        message: "Invalid Email or password!",
      });
    }
    
    const isPasswordValid = bcrypt.compareSync(password, admin.password);
    console.log('Password valid:', isPasswordValid);
    
    if (isPasswordValid) {
      const token = generateToken(admin);
      res.status(200).json({
        token,
        _id: admin._id,
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
        image: admin.image,
        role: admin.role,
      });
    } else {
      console.log('Password comparison failed');
      res.status(401).json({
        status: "fail",
        message: "Invalid Email or password!",
      });
    }
  } catch (err) {
    console.error('Login error:', err);
    next(err)
  }
};
// forget password
const forgetPassword = async (req, res,next) => {
  try {
    const { email } = req.body;
   
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(404).send({
        message: "Admin Not found with this email!",
      });
    } else {
      const token = tokenForVerify(admin);
      const body = {
        from: secret.email_user,
        to: `${email}`,
        subject: "Password Reset",
        html: `<h2>Hello ${email}</h2>
        <p>A request has been received to change the password for your <strong>Hracine</strong> account </p>

        <p>This link will expire in <strong> 10 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for reset your password</p>

        <a href=${secret.admin_url}/forget-password/${token} style="background:#0989FF;color:white;border:1px solid #0989FF; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password</a>

        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at hello.hracine@gmail.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>Hraine Team</strong>
        `,
      };
      admin.confirmationToken = token;
      const date = new Date();
      date.setDate(date.getDate() + 1);
      admin.confirmationTokenExpires = date;
      await admin.save({ validateBeforeSave: false });
      const message = "Please check your email to reset password!";
      sendEmail(body, res, message);
    }
  } catch (error) {
    next(error)
  }
};
// confirm-forget-password
const confirmAdminForgetPass = async (req, res,next) => {
  try {
    const { token, password } = req.body;
    const admin = await Admin.findOne({ confirmationToken: token });

    if (!admin) {
      return res.status(403).json({
        status: "fail",
        message: "Invalid token",
      });
    }

    const expired = new Date() > new Date(admin.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "fail",
        message: "Token expired",
      });
    } else {
      const newPassword = bcrypt.hashSync(password);
      await Admin.updateOne(
        { confirmationToken: token },
        { $set: { password: newPassword } }
      );

      admin.confirmationToken = undefined;
      admin.confirmationTokenExpires = undefined;

      await admin.save({ validateBeforeSave: false });

      res.status(200).json({
        message: "Password reset successfully",
      });
    }
  } catch (error) {
    next(error)
  }
};

// change password
const changePassword = async (req,res,next) => {
  try {
    const {email,oldPass,newPass} = req.body || {};
    const admin = await Admin.findOne({ email: email });
    // Check if the admin exists
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    if(!bcrypt.compareSync(oldPass, admin.password)){
      return res.status(401).json({ message: "Incorrect current password" });
    }
    else {
      const hashedPassword = bcrypt.hashSync(newPass);
      await Admin.updateOne({email:email},{password:hashedPassword})
      res.status(200).json({ message: "Password changed successfully" });
    }
  } catch (error) {
    next(error)
  }
}
// reset Password
const resetPassword = async (req, res) => {
  const token = req.body.token;
  const { email } = jwt.decode(token);
  const staff = await Admin.findOne({ email: email });

  if (token) {
    jwt.verify(token,secret.jwt_secret_for_verify,(err, decoded) => {
      if (err) {
        return res.status(500).send({
          message: "Token expired, please try again!",
        });
      } else {
        staff.password = bcrypt.hashSync(req.body.newPassword);
        staff.save();
        res.send({
          message: "Your password change successful, you can login now!",
        });
      }
    });
  }
};
// add staff
const addStaff = async (req, res,next) => {
  try {
    const isAdded = await Admin.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(500).send({
        message: "This Email already Added!",
      });
    } else {
      const newStaff = new Admin({
        name:req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        phone: req.body.phone,
        joiningDate: req.body.joiningDate,
        role: req.body.role,
        image: req.body.image,
      });
      await newStaff.save();
      res.status(200).send({
        message: "Staff Added Successfully!",
      });
    }
  } catch (err) {
    next(err)
  }
};
// get all staff
const getAllStaff = async (req, res,next) => {
  try {
    const admins = await Admin.find({}).sort({ _id: -1 });
    res.status(200).json({
      status:true,
      message:'Staff get successfully',
      data:admins
    });
  } catch (err) {
    next(err)
  }
};
// getStaffById
const getStaffById = async (req, res,next) => {

  try {
    const admin = await Admin.findById(req.params.id);
    res.send(admin);
  } catch (err) {
    next(err)
  }
};
// updateStaff
const updateStaff = async (req, res) => {
  try {
    const admin = await Admin.findOne({ _id: req.params.id });
    if (admin) {
      admin.name = req.body.name;
      admin.email = req.body.email;
      admin.phone = req.body.phone;
      admin.role = req.body.role;
      admin.joiningData = req.body.joiningDate;
      admin.image = req.body.image;
      admin.password =
      req.body.password !== undefined
        ? bcrypt.hashSync(req.body.password)
        : admin.password;
      const updatedAdmin = await admin.save();
      const token = generateToken(updatedAdmin);
      res.send({
        token,
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        image: updatedAdmin.image,
        phone: updatedAdmin.phone,
      });
    } else {
      res.status(404).send({
        message: "This Staff not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
// deleteStaff
const deleteStaff = async (req, res,next) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message:'Admin Deleted Successfully',
    });
  } catch (err) {
    next(err)
  }
};

const updatedStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await Admin.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.send({
      message: `Store ${newStatus} Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get all users (admin)
const getAllUsers = async (req, res, next) => {
  try {
    const User = require("../model/User");
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// get single user (admin)
const getSingleUser = async (req, res, next) => {
  try {
    const User = require("../model/User");
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      status: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// update user status (admin)
const updateUserStatus = async (req, res, next) => {
  try {
    const User = require("../model/User");
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// update user (admin)
const updateUser = async (req, res, next) => {
  try {
    const User = require("../model/User");
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// get all orders (admin)
const getAllOrders = async (req, res, next) => {
  try {
    const Order = require("../model/Order");
    const orders = await Order.find({}).populate('user').sort({ createdAt: -1 });
    res.status(200).json({
      status: true,
      message: 'Orders retrieved successfully',
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

// create default admin if none exists (for development)
const createDefaultAdmin = async (req, res, next) => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'dorothy@gmail.com' });
    if (existingAdmin) {
      return res.status(200).json({
        status: true,
        message: 'Default admin already exists',
        data: { email: existingAdmin.email }
      });
    }

    const defaultAdmin = new Admin({
      name: 'Dorothy R. Brown',
      email: 'dorothy@gmail.com',
      password: bcrypt.hashSync('123456'),
      role: 'Admin',
      status: 'Active',
      phone: '708-628-3122',
      image: 'https://i.ibb.co/wpjNftS/user-2.jpg',
    });

    await defaultAdmin.save();
    res.status(201).json({
      status: true,
      message: 'Default admin created successfully',
      data: { email: defaultAdmin.email, password: '123456' }
    });
  } catch (err) {
    next(err);
  }
};

// get dashboard stats (admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const User = require("../model/User");
    const Order = require("../model/Order");
    const Product = require("../model/Products");
    const Category = require("../model/Category");
    const Blog = require("../model/Blog");
    const productServices = require("../services/product.service");
    
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
    
    // Get top rated products (top 10)
    const topRatedProducts = await productServices.getTopRatedProductService();
    const topRated = topRatedProducts.slice(0, 10).map(product => ({
      _id: product._id,
      title: product.title,
      img: product.img,
      price: product.price,
      rating: product.rating,
      reviewCount: product.reviews?.length || 0,
      brand: product.brand?.name || 'N/A'
    }));
    
    // Get most reviewed products (top 10)
    const mostReviewedProducts = await Product.find({
      reviews: { $exists: true, $ne: [] }
    })
      .populate('reviews')
      .sort({ 'reviews.length': -1 })
      .limit(10)
      .select('title img price brand reviews');
    
    const mostReviewed = mostReviewedProducts.map(product => {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / product.reviews.length;
      return {
        _id: product._id,
        title: product.title,
        img: product.img,
        price: product.price,
        rating: averageRating,
        reviewCount: product.reviews.length,
        brand: product.brand?.name || 'N/A'
      };
    });
    
    res.status(200).json({
      status: true,
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalCategories,
        totalBlogs,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        revenue,
        topRatedProducts: topRated,
        mostReviewedProducts: mostReviewed
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatedStatus,
  changePassword,
  confirmAdminForgetPass,
  getAllUsers,
  getSingleUser,
  updateUserStatus,
  updateUser,
  getAllOrders,
  getDashboardStats,
  createDefaultAdmin,
};
