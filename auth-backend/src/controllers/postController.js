import Like from "../models/Like.js";

import {
  createPostRepo,
  getAllPostsRepo,
  getPostByIdRepo,
  updatePostRepo,
  deletePostRepo,
} from "../repositories/postRepository.js";

// CREATE POST
export const createPost = async (req, res) => {
  try {
    const userId = req.user.id;

    const { content, image } = req.body;

    // Validation
    if (!content && !image) {
      return res.status(400).json({
        message: "Post must have content or image",
      });
    }

    // Create post
    const post = await createPostRepo({
      userId,
      content,
      image,
    });

    res.status(201).json({
      message: "Post created successfully",

      data: {
        ...post.toObject(),
        currentUserLiked: false,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET ALL POSTS
export const getAllPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const userId = req.user.id;

    const { posts, total } = await getAllPostsRepo({
      page,
      limit,
    });

    // Add currentUserLiked
    const updatedPosts = await Promise.all(
      posts.map(async (post) => {
        const existingLike = await Like.findOne({
          userId,
          targetId: post._id,
          targetType: "Post",
        });

        return {
          ...post.toObject(),

          currentUserLiked: !!existingLike,
        };
      }),
    );

    res.status(200).json({
      data: updatedPosts,

      pagination: {
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// GET SINGLE POST
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await getPostByIdRepo(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json({
      data: post,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// UPDATE POST
export const updatePost = async (req, res) => {
  try {
    const userId = req.user.id;

    const { postId } = req.params;

    const { content, image } = req.body;

    const updatedPost = await updatePostRepo(postId, userId, {
      content,
      image,
    });

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post not found or unauthorized",
      });
    }

    res.status(200).json({
      message: "Post updated successfully",

      data: updatedPost,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// DELETE POST
export const deletePost = async (req, res) => {
  try {
    const userId = req.user.id;

    const { postId } = req.params;

    const deletedPost = await deletePostRepo(postId, userId);

    if (!deletedPost) {
      return res.status(404).json({
        message: "Post not found or unauthorized",
      });
    }

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
