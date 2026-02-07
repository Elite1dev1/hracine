const ApiError = require('../errors/api-error');
const BlogComment = require('../model/BlogComment');
const Blog = require('../model/Blog');

// create blog comment service
exports.createBlogCommentService = async (data) => {
  const comment = await BlogComment.create(data);
  
  // Add comment to blog's comments array
  await Blog.findByIdAndUpdate(data.blogId, {
    $push: { comments: comment._id }
  });
  
  return await BlogComment.findById(comment._id).populate('userId', 'name email imageURL');
}

// get comments by blog ID service
exports.getBlogCommentsService = async (blogId) => {
  const comments = await BlogComment.find({ 
    blogId,
    parentCommentId: null // Only get top-level comments
  })
    .populate('userId', 'name email imageURL')
    .sort({ createdAt: -1 });
  
  // Get replies for each comment
  for (let comment of comments) {
    const replies = await BlogComment.find({ parentCommentId: comment._id })
      .populate('userId', 'name email imageURL')
      .sort({ createdAt: 1 });
    comment.replies = replies;
  }
  
  return comments;
}

// delete blog comment service
exports.deleteBlogCommentService = async (id) => {
  const comment = await BlogComment.findById(id);
  if (!comment) {
    throw new ApiError(404, 'Comment not found!');
  }
  
  // Remove comment from blog's comments array
  await Blog.findByIdAndUpdate(comment.blogId, {
    $pull: { comments: id }
  });
  
  // Delete all replies
  await BlogComment.deleteMany({ parentCommentId: id });
  
  // Delete the comment
  const result = await BlogComment.findByIdAndDelete(id);
  return result;
}
