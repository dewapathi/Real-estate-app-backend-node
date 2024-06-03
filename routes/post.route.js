import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";
import { createPost, deletePost, getAllPosts, getPostById, updatePost } from "../controllers/post.controller.js";

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", verifyToken, createPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;