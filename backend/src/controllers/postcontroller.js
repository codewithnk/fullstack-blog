import { ROLES } from "../constants/roles.js";
import Post from "../models/postmodel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPost = asyncHandler(async (req, res) => {
  const post = await Post.create({
    ...req.body,
    author: req.user.id,
    status: "DRAFT",
  });
  res.status(201).json(post);
});

export const getPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const query = {
    status: "PUBLISHED",
    title: { $regex: search, $options: "i" },
  };
  const posts = await Post.find(query)
    .populate("author", "name")
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });
  const total = await Post.countDocuments(query);
  res.json({
    posts,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
});

export const updatedPosts = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  if (post.author.toString() !== req.user.id && req.user.role !== ROLES.ADMIN) {
    res.status(403);
    throw new Error("Not allowed");
  }
  Object.assign(post, req.body);
  await post.save();
  res.json(post);
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  if (post.author.toString() !== req.user.id && req.user.role !== ROLES.ADMIN) {
    res.status(403);
    throw new Error("Not allowed");
  }
  await post.deleteOne();
  res.json({ message: "Post deleted" });
});
