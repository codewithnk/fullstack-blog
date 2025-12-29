import Comment from "../models/commentmodel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//AddComment
export const addComment = asyncHandler(async (req, res) => {
  const comment = await Comment.create({
    content: req.body.content,
    post: req.body.postId,
    parentComment: req.body.parentComment || null,
    author: req.user.id,
  });
  res.status(201).json(comment);
});

// Like or Unlike comment
export const toggleLike = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  const liked = comment.likes.includes(req.user.id);
  comment.likes = liked
    ? comment.likes.filter((id) => id.toString() !== req.user.id)
    : [...comment.likes, req.user.id];
  await comment.save();
  res.json(comment);
});
