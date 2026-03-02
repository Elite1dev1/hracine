require('dotenv').config();
const { connectDB } = require('./config/db');
const Blog = require('./model/Blog');

const checkBlogs = async () => {
  await connectDB();

  try {
    // Get all blogs
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    
    // Get published blogs
    const publishedBlogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 });
    
    // Get draft blogs
    const draftBlogs = await Blog.find({ status: 'draft' }).sort({ createdAt: -1 });
    
    // Get archived blogs
    const archivedBlogs = await Blog.find({ status: 'archived' }).sort({ createdAt: -1 });
    
    console.log('\n📊 Blog Status Report\n');
    console.log(`Total Blogs: ${allBlogs.length}`);
    console.log(`Published Blogs: ${publishedBlogs.length}`);
    console.log(`Draft Blogs: ${draftBlogs.length}`);
    console.log(`Archived Blogs: ${archivedBlogs.length}`);
    
    if (publishedBlogs.length > 0) {
      console.log('\n✅ Published Blogs:');
      publishedBlogs.forEach((blog, index) => {
        console.log(`\n${index + 1}. ${blog.title}`);
        console.log(`   ID: ${blog._id}`);
        console.log(`   Slug: ${blog.slug || 'N/A'}`);
        console.log(`   Status: ${blog.status}`);
        console.log(`   Blog Type: ${blog.blog_type || 'N/A'}`);
        console.log(`   Created: ${blog.createdAt}`);
      });
    } else {
      console.log('\n❌ No published blogs found.');
      console.log('\n💡 To publish a blog:');
      console.log('   1. Go to your admin panel');
      console.log('   2. Navigate to the blog management section');
      console.log('   3. Edit a blog and change its status to "published"');
    }
    
    if (draftBlogs.length > 0) {
      console.log('\n📝 Draft Blogs (not published):');
      draftBlogs.forEach((blog, index) => {
        console.log(`   ${index + 1}. ${blog.title} (${blog.status})`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking blogs:', error);
    process.exit(1);
  }
};

checkBlogs();
