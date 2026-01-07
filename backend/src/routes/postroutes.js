import express from "express";
import { protect } from "../middlewares/authmiddleware.js";
import { optionalProtect } from "../middlewares/optionalProtect.js";
import { authorize } from "../middlewares/rolemiddleware.js";
import { ROLES } from "../constants/roles.js";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postcontroller.js";

const router = express.Router();

// Public: Home Page
router.get("/", getPosts);

// Protected: Read post details
router.get("/:id", optionalProtect, getPostById);

// Protected: Create post
router.post("/", protect, authorize(ROLES.AUTHOR, ROLES.ADMIN), createPost);

// Protected: Update
router.put("/:id", protect, updatePost);

// Protected: Delete
router.delete("/:id", protect, deletePost);

export default router;
