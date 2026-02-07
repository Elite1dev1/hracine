const blogServices = require("../services/blog.service");

// add blog
exports.addBlog = async (req, res, next) => {
  try {
    const result = await blogServices.createBlogService(req.body);
    res.status(200).json({
      status: "success",
      message: "Blog created successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// get all blogs
exports.getAllBlogs = async (req, res, next) => {
  try {
    const result = await blogServices.getAllBlogsService();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// get published blogs
exports.getPublishedBlogs = async (req, res, next) => {
  try {
    const result = await blogServices.getPublishedBlogsService();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// get single blog
exports.getSingleBlog = async (req, res, next) => {
  try {
    const result = await blogServices.getSingleBlogService(req.params.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// update blog
exports.updateBlog = async (req, res, next) => {
  try {
    const result = await blogServices.updateBlogService(req.params.id, req.body);
    res.status(200).json({
      status: "success",
      message: "Blog updated successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// delete blog
exports.deleteBlog = async (req, res, next) => {
  try {
    const result = await blogServices.deleteBlogService(req.params.id);
    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
