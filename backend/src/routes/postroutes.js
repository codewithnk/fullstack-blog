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

// Public route
router.get("/", getPosts);

// Protected routes with role-based access
router.post("/", protect, authorize(ROLES.AUTHOR, ROLES.ADMIN), createPost);
router.put("/:id", protect, authorize(ROLES.AUTHOR, ROLES.ADMIN), updatedPosts);
router.delete(
  "/:id",
  protect,
  authorize(ROLES.AUTHOR, ROLES.ADMIN),
  deletePost
);

export default router;
