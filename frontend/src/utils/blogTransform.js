/**
 * Transform backend blog data to frontend format
 * @param {Object} blog - Blog object from backend API
 * @returns {Object} - Transformed blog object for frontend
 */
export const transformBlog = (blog) => {
  if (!blog) return null;

  // Format date from createdAt timestamp
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  // Get comment count (if comments array exists)
  const commentCount = blog.comments?.length || 0;

  return {
    id: blog._id || blog.id,
    _id: blog._id,
    img: blog.img || '',
    list_img: blog.list_img || blog.img || '', // Fallback to img if list_img not provided
    date: formatDate(blog.createdAt),
    author: blog.author || '',
    title: blog.title || '',
    desc: blog.desc || blog.sm_desc || '', // Use desc if available, fallback to sm_desc
    sm_desc: blog.sm_desc || '',
    content: blog.content || '',
    category: blog.category || '',
    tags: blog.tags || [],
    comments: commentCount,
    blog: blog.blog_type || 'blog-grid', // Map blog_type to blog for filtering
    blog_type: blog.blog_type || 'blog-grid',
    status: blog.status || 'draft',
    featured: blog.featured || false,
    views: blog.views || 0,
    // Special post types
    video: blog.video || false,
    video_id: blog.video_id || '',
    audio: blog.audio || false,
    audio_id: blog.audio_id || '',
    slider: blog.slider || false,
    slider_images: blog.slider_images || [],
    blockquote: blog.blockquote || false,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    // SEO fields
    slug: blog.slug || '',
    metaTitle: blog.metaTitle || blog.title || '',
    metaDescription: blog.metaDescription || blog.sm_desc?.substring(0, 160) || '',
    keywords: blog.keywords || [],
  };
};

/**
 * Transform array of blogs
 * @param {Array} blogs - Array of blog objects from backend
 * @returns {Array} - Array of transformed blog objects
 */
export const transformBlogs = (blogs) => {
  if (!Array.isArray(blogs)) return [];
  return blogs.map(transformBlog).filter(Boolean);
};
