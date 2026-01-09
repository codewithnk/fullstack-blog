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
  getMyPosts,
} from "../controllers/postcontroller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/my", protect, authorize(ROLES.AUTHOR, ROLES.ADMIN), getMyPosts);
router.get("/:id", protect, getPostById);
router.post("/", protect, authorize(ROLES.AUTHOR, ROLES.ADMIN), createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;
