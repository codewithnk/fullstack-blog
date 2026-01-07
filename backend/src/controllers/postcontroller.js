import Post from "../models/postmodel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ROLES } from "../constants/roles.js";

// Create Post
export const createPost = asyncHandler(async (req, res) => {
  const { title, content, status } = req.body;
  if (!title || !content) {
    res.status(400);
    throw new Error("Title and content are required");
  }

  // Only admin can set published
  let finalStatus = "DRAFT";
  if (req.user.role === ROLES.ADMIN && status === "PUBLISHED") {
    finalStatus = "PUBLISHED";
  }

  const post = await Post.create({
    title,
    content,
    author: req.user.id,
    status: finalStatus,
  });

  res.status(201).json(post);
});

// Get Published Posts (Home Page)
export const getPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const posts = await Post.find({ status: "PUBLISHED" })
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Post.countDocuments({ status: "PUBLISHED" });

  res.json({
    posts,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
});

// Get Single Post (Logged-in Required)
// export const getPostById = asyncHandler(async (req, res) => {
//   const post = await Post.findById(req.params.id).populate("author", "name");

//   if (!post) {
//     res.status(404);
//     throw new Error("Post not found");
//   }

//   // Only published posts or own drafts
//   if (
//     post.status !== "PUBLISHED" &&
//     post.author._id.toString() !== req.user.id &&
//     req.user.role !== ROLES.ADMIN
//   ) {
//     res.status(403);
//     throw new Error("You are not allowed to view this post");
//   }

//   res.json(post);
// });

export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "name");

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  // If post is draft and user is NOT logged in or not author/admin
  if (post.status !== "PUBLISHED") {
    if (!req.user) {
      res.status(401);
      throw new Error("You must login to view this post");
    }
    if (
      post.author._id.toString() !== req.user.id &&
      req.user.role !== ROLES.ADMIN
    ) {
      res.status(403);
      throw new Error("You are not allowed to view this post");
    }
  }

  res.json(post);
});

// Update Post
export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  // Only author or admin can update
  if (post.author.toString() !== req.user.id && req.user.role !== ROLES.ADMIN) {
    res.status(403);
    throw new Error("Not allowed");
  }

  // Only admin can publish
  if (req.body.status === "PUBLISHED" && req.user.role !== ROLES.ADMIN) {
    res.status(403);
    throw new Error("Only admin can publish posts");
  }

  Object.assign(post, req.body);
  await post.save();
  res.json(post);
});

// Delete Post
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
