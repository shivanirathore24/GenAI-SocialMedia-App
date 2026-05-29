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

    const { targetId, targetType } = req.body;

    // Validation
    if (!targetId || !targetType) {
      return res.status(400).json({
        message: "Target ID and target type are required",
      });
    }

    // Check existing like
    const existingLike = await findLikeRepo(userId, targetId, targetType);

    if (existingLike) {
      return res.status(400).json({
        message: "Already liked",
      });
    }

    // Create Like
    await createLikeRepo(userId, targetId, targetType);

    let updatedTarget = null;

    // Increment likes count
    if (targetType === "Post") {
      updatedTarget = await incrementPostLikesRepo(targetId);
    }

    res.status(201).json({
      message: "Liked successfully",
      data: updatedTarget,
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

    const { targetId, targetType } = req.body;

    // Validation
    if (!targetId || !targetType) {
      return res.status(400).json({
        message: "Target ID and target type are required",
      });
    }

    // Check existing like
    const existingLike = await findLikeRepo(userId, targetId, targetType);

    if (!existingLike) {
      return res.status(400).json({
        message: "Like does not exist",
      });
    }

    // Remove Like
    await removeLikeRepo(userId, targetId, targetType);

    let updatedTarget = null;

    // Decrement likes count
    if (targetType === "Post") {
      updatedTarget = await decrementPostLikesRepo(targetId);
    }

    res.status(200).json({
      message: "Like removed successfully",
      data: updatedTarget,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
