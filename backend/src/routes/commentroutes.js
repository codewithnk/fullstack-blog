import express from "express";
import { addComment, toggleLike } from "../controllers/commentcontroller.js";
import { protect } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.post("/", protect, addComment);
router.patch("/:id/like", protect, toggleLike);
export default router;
