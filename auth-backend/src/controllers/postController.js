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
    const { content, image } = req.body;

    if (!content && !image) {
      return res.status(400).json({
        message: "Post must have content or image",
      });
    }

    const post = await createPostRepo({
      userId: req.user.id,
      content,
      image,
    });

    res.status(201).json({
      message: "Post created successfully",
      data: post,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL POSTS
export const getAllPosts = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const { posts, total } = await getAllPostsRepo({ page, limit });

    res.json({
      data: posts,
      pagination: {
        page,
        limit,
        total,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE POST
export const getPostById = async (req, res) => {
  try {
    const post = await getPostByIdRepo(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json({ data: post });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE POST
export const updatePost = async (req, res) => {
  try {
    const { content, image } = req.body;

    if (!content && !image) {
      return res.status(400).json({
        message: "Post must have content or image",
      });
    }

    const updatedPost = await updatePostRepo(
      req.params.id,
      req.user.id,
      { content, image }
    );

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post not found or unauthorized",
      });
    }

    res.json({
      message: "Post updated successfully",
      data: updatedPost,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE POST
export const deletePost = async (req, res) => {
  try {
    const deletedPost = await deletePostRepo(
      req.params.id,
      req.user.id
    );

    if (!deletedPost) {
      return res.status(404).json({
        message: "Post not found or unauthorized",
      });
    }

    res.json({
      message: "Post deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};