const ApiError = require('../errors/api-error');
const Blog = require('../model/Blog');

// create blog service
exports.createBlogService = async (data) => {
  const blog = await Blog.create(data);
  return blog;
}

// get all blogs service
exports.getAllBlogsService = async () => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 });
  return blogs;
}

// get published blogs service
exports.getPublishedBlogsService = async () => {
  const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 });
  return blogs;
}

// get single blog service (by ID or slug)
exports.getSingleBlogService = async (identifier) => {
  // Check if identifier is a valid MongoDB ObjectId (24 hex characters)
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  
  let blog;
  if (isObjectId) {
    blog = await Blog.findById(identifier);
  } else {
    // Try to find by slug
    blog = await Blog.findOne({ slug: identifier });
  }
  
  if (!blog) {
    throw new ApiError(404, 'Blog not found!');
  }
  // Increment views
  blog.views += 1;
  await blog.save();
  return blog;
}

// update blog service
exports.updateBlogService = async (id, payload) => {
  const isExist = await Blog.findOne({ _id: id });

  if (!isExist) {
    throw new ApiError(404, 'Blog not found!');
  }

  const result = await Blog.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
}

// delete blog service
exports.deleteBlogService = async (id) => {
  const result = await Blog.findByIdAndDelete(id);
  return result;
}
