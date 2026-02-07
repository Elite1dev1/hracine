const mongoose = require("mongoose");

const blogCommentSchema = mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: [true, "Blog ID is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    comment: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogComment",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Populate user details when querying
blogCommentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    select: "name email image",
  });
  next();
});

const BlogComment = mongoose.model("BlogComment", blogCommentSchema);

module.exports = BlogComment;
