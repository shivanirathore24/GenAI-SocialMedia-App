import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 All routes start with /api/posts

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getAllPosts);
router.get("/:id", authMiddleware, getPostById);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
