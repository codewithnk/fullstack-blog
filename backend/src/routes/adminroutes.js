import express from "express";
import {
  changeUserRole,
  createCategory,
  createTag,
  deleteAnyPost,
  getAllUsers,
  toggleBlockUser,
  togglePublishPost,
} from "../controllers/admincontroller.js";
import { ROLES } from "../constants/roles.js";
import { authorize } from "../middlewares/rolemiddleware.js";
import { protect } from "../middlewares/authmiddleware.js";

const router = express.Router();
router.use(protect, authorize(ROLES.ADMIN));
router.get("/users", getAllUsers);
router.patch("/users/:id/block", toggleBlockUser);
router.patch("/users/:id/role", changeUserRole);
router.patch("/posts/:id/publish", togglePublishPost);
router.delete("/posts/:id", deleteAnyPost);
router.post("/categories", createCategory);
router.post("/tags", createTag);

export default router;
