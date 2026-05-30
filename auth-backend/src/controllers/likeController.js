import {
  findLikeRepo,
  createLikeRepo,
  removeLikeRepo,
  incrementPostLikesRepo,
  decrementPostLikesRepo,
} from "../repositories/likeRepository.js";

// ❤️ Add Like
export const addLike = async (req, res) => {
  try {
    const userId = req.user.id;

    const { postId } = req.body;

    // Validation
    if (!postId) {
      return res.status(400).json({
        message: "Post ID is required",
      });
    }

    // Already liked?
    const existingLike = await findLikeRepo(userId, postId, "Post");

    if (existingLike) {
      return res.status(400).json({
        message: "Post already liked",
      });
    }

    // Create Like
    await createLikeRepo(userId, postId, "Post");

    // Increment count
    const updatedPost = await incrementPostLikesRepo(postId);

    res.status(201).json({
      message: "Liked successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// 💔 Remove Like
export const removeLike = async (req, res) => {
  try {
    const userId = req.user.id;

    const { postId } = req.body;

    // Validation
    if (!postId) {
      return res.status(400).json({
        message: "Post ID is required",
      });
    }

    // Like exists?
    const existingLike = await findLikeRepo(userId, postId, "Post");

    if (!existingLike) {
      return res.status(400).json({
        message: "Post not liked yet",
      });
    }

    // Remove Like
    await removeLikeRepo(userId, postId, "Post");

    // Decrement count
    const updatedPost = await decrementPostLikesRepo(postId);

    res.status(200).json({
      message: "Like removed successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
