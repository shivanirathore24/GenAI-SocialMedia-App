import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import { addLike, removeLike } from "../controllers/likeController.js";

const router = express.Router();

// Add Like
router.post("/", authMiddleware, addLike);

// Remove Likel̥
router.delete("/", authMiddleware, removeLike);

export default router;
