import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import { addLike, removeLike } from "../controllers/likeController.js";

const router = express.Router();

// ❤️ Like Post
router.post("/", authMiddleware, addLike);

// 💔 Unlike Post
router.delete("/", authMiddleware, removeLike);

export default router;
