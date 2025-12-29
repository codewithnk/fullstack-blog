import express from "express";
import {
  createPost,
  deletePost,
  getPosts,
  updatedPosts,
} from "../controllers/postcontroller.js";
import { authorize } from "../middlewares/rolemiddleware.js";
import { ROLES } from "../constants/roles.js";
import { protect } from "../middlewares/authmiddleware.js";

const router = express.Router();
router.get("/", getPosts);
router.post("/", protect, authorize(ROLES.AUTHOR, ROLES.ADMIN), createPost);
router.put("/:id", protect, updatedPosts);
router.delete("/:id", protect, deletePost);

export default router;
