const mongoose = require("mongoose");
const validator = require("validator");

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for this blog."],
      trim: true,
      minLength: [3, "Title must be at least 3 characters."],
      maxLength: [200, "Title is too large"],
    },
    slug: {
      type: String,
      trim: true,
      required: false,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    metaTitle: {
      type: String,
      trim: true,
      required: false,
      maxLength: [60, "Meta title should be 60 characters or less for optimal SEO"],
    },
    metaDescription: {
      type: String,
      trim: true,
      required: false,
      maxLength: [160, "Meta description should be 160 characters or less for optimal SEO"],
    },
    keywords: {
      type: [String],
      required: false,
    },
    img: {
      type: String,
      required: true,
      validate: [validator.isURL, "Please provide valid url(s)"]
    },
    list_img: {
      type: String,
      required: false,
      validate: [validator.isURL, "Please provide valid url(s)"]
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    tags: [String],
    sm_desc: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: false,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    blog_type: {
      type: String,
      enum: ["blog-grid", "blog-postbox", "electronics", "fashion"],
      default: "blog-grid",
    },
    video: {
      type: Boolean,
      default: false,
    },
    video_id: {
      type: String,
      required: false,
    },
    audio: {
      type: Boolean,
      default: false,
    },
    audio_id: {
      type: String,
      required: false,
    },
    slider: {
      type: Boolean,
      default: false,
    },
    slider_images: [{
      type: String,
      validate: [validator.isURL, "Please provide valid url(s)"]
    }],
    blockquote: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogComment"
    }],
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title if not provided
blogSchema.pre('save', async function (next) {
  if (!this.slug && this.title) {
    // Generate slug from title
    let baseSlug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    
    // Ensure slug is unique by appending number if needed
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const existingBlog = await this.constructor.findOne({ slug: slug });
      if (!existingBlog || existingBlog._id.toString() === this._id?.toString()) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  
  // If metaTitle is not provided, use title
  if (!this.metaTitle && this.title) {
    this.metaTitle = this.title;
  }
  
  // If metaDescription is not provided, use sm_desc
  if (!this.metaDescription && this.sm_desc) {
    this.metaDescription = this.sm_desc.substring(0, 160);
  }
  
  next();
});

// Index for faster slug queries
blogSchema.index({ slug: 1 });

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
