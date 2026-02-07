const blogCommentServices = require("../services/blogComment.service");

// add blog comment
exports.addBlogComment = async (req, res, next) => {
  try {
    const { blogId, comment, parentCommentId } = req.body;
    const userId = req.user?._id; // Get from authenticated user (verifyToken sets req.user with _id from token)
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }
    
    const result = await blogCommentServices.createBlogCommentService({
      blogId,
      userId,
      comment,
      parentCommentId: parentCommentId || null,
    });
    
    res.status(200).json({
      status: "success",
      message: "Comment added successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// get comments by blog ID
exports.getBlogComments = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const result = await blogCommentServices.getBlogCommentsService(blogId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// delete blog comment
exports.deleteBlogComment = async (req, res, next) => {
  try {
    const result = await blogCommentServices.deleteBlogCommentService(req.params.id);
    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
