import { ROLES } from "../constants/roles.js";
import User from "../models/usermodel.js";
import Post from "../models/postmodel.js";
import Category from "../models/categorymodel.js";
import Tag from "../models/tagmodel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password - refreshToken");
  res.json(users);
});

//Block and unblock user
export const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.param.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({
    message: `User ${user.isBlocked ? "blocked" : "unblocked"}`,
  });
});

// Change Role
export const changeUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!Object.values(ROLES).includes(role)) {
    res.status(400);
    throw new Error("Invalid role");
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );
  res.json({ message: "Role Updated", user });
});

// published and unpublished
export const togglePublishPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  post.isPublished = !post.isPublished;
  await post.save();
  res.json({
    message: `Post ${post.isPublished ? "published" : "unpublished"}`,
  });
});

// post delete
export const deleteAnyPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  await post.deleteOne();
  res.json({ message: "Post deleted by admin" });
});

// Create Category
export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({ name: req.body.name });
  res.status(201).json(category);
});

//create Tags
export const createTag = asyncHandler(async (req, res) => {
  const tag = await Tag.create({ name: req.body.name });
  res.status(201).json(tag);
});
