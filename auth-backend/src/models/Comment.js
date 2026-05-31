import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: [true, "User is required"],
    },

    postId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Post",

      required: [true, "Post is required"],
    },

    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Comment",

      default: null,

      index: true,
    },

    content: {
      type: String,

      required: [true, "Content is required"],

      trim: true,
    },

    likesCount: {
      type: Number,

      default: 0,
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

// Validate parent comment
commentSchema.pre("save", async function () {
  // Skip if no parent
  if (!this.parentCommentId) {
    return;
  }

  // Check parent exists
  const parentExists = await mongoose.model("Comment").exists({
    _id: this.parentCommentId,
  });

  if (!parentExists) {
    throw new Error("Parent comment does not exist");
  }
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
