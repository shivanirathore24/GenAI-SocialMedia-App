import Post from "../models/Post.js";

// CREATE
export const createPostRepo = async (data) => {
  const post = await Post.create(data);

  // 🔥 Return populated post
  return await Post.findById(post._id).populate("userId", "email");
};

// GET ALL (with pagination)
export const getAllPostsRepo = async ({ page, limit }) => {
  const skip = (page - 1) * limit;

  const posts = await Post.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("userId", "email");

  const total = await Post.countDocuments({ isDeleted: false });

  return { posts, total };
};

// GET ONE
export const getPostByIdRepo = async (postId) => {
  return await Post.findOne({ _id: postId, isDeleted: false }).populate(
    "userId",
    "email",
  );
};

// UPDATE
export const updatePostRepo = async (postId, userId, updateData) => {
  return await Post.findOneAndUpdate(
    {
      _id: postId,
      userId,
      isDeleted: false,
    },
    updateData,
    { new: true },
  ).populate("userId", "email");
};

// DELETE (soft delete)
export const deletePostRepo = async (postId, userId) => {
  return await Post.findOneAndUpdate(
    { _id: postId, userId, isDeleted: false },
    { isDeleted: true },
    { new: true },
  );
};
