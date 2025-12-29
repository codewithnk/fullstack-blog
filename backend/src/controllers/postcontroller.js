import { ROLES } from "../constants/roles.js";
import Post from "../models/postmodel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Create Post
export const createPost = asyncHandler(async (req, res) => {
  const post = await Post.create({
    ...req.body,
    author: req.user.id,
  });
  res.status(201).json(Post);
});

//Get All public Post
export const getPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const query = {
    isPublished: true,
    title: {
      $regex: search,
      $option: "i",
    },
  };
  const posts = await Post.find(query)
    .populate("author", "name")
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });
  res.json(posts);
});

//Updayed Post
export const updatedPosts = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.param.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not Found");
  }
  if (post.author.toString() !== req.user.id && req.user.role !== ROLES.ADMIN) {
    res.status(403);
    throw new Error("Not Allowed");
  }
  Object.assign(post, req.body);
  awaitpost.save();
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
