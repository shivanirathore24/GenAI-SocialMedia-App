import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [1, "Post cannot be empty"],
      maxlength: [280, "Post cannot exceed 280 characters"],
    },

    image: {
      type: String,
      default: null,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(value);
        },
        message: "Invalid image URL",
      },
    },

    likesCount: {
      type: Number,
      default: 0,
      min: [0, "Likes cannot be negative"],
    },

    commentsCount: {
      type: Number,
      default: 0,
      min: [0, "Comments cannot be negative"],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// 🔥 Indexes (critical for feed performance)
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

// 🔒 Prevent empty + no-image posts
postSchema.pre("validate", function () {
  if (!this.content && !this.image) {
    throw new Error("Post must have content or image");
  }
});

const Post = mongoose.model("Post", postSchema);

export default Post;
