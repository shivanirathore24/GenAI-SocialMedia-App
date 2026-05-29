import Like from "../models/Like.js";

import Post from "../models/Post.js";

// Find existing like
export const findLikeRepo = async (userId, targetId, targetType) => {
  return await Like.findOne({
    userId,
    targetId,
    targetType,
  });
};

// Create like
export const createLikeRepo = async (userId, targetId, targetType) => {
  return await Like.create({
    userId,
    targetId,
    targetType,
  });
};

// Remove like
export const removeLikeRepo = async (userId, targetId, targetType) => {
  return await Like.findOneAndDelete({
    userId,
    targetId,
    targetType,
  });
};

// Increment post likes
export const incrementPostLikesRepo = async (postId) => {
  return await Post.findByIdAndUpdate(
    postId,
    {
      $inc: {
        likesCount: 1,
      },
    },
    {
      new: true,
    },
  );
};

// Decrement post likes
export const decrementPostLikesRepo = async (postId) => {
  return await Post.findByIdAndUpdate(
    postId,
    {
      $inc: {
        likesCount: -1,
      },
    },
    {
      new: true,
    },
  );
};
