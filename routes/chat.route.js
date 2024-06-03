import express from "express";
import { addChat, getChatById, getChats, readChat } from "../controllers/chat.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getChats);
router.get("/:id", verifyToken, getChatById);
router.post("/", verifyToken, addChat);
router.get("/read/:id", verifyToken, readChat);

export default router;