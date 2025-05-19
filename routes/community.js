const express = require("express");
const router = express.Router();
const { Post, Comment } = require("../models/Post");
const { protect } = require("../middleware/authMiddleware");

//  Create post
router.post("/posts", protect, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.create({
      user: req.user.id,
      content,
      likes: [],
      comments: [],
    });

    const populatedPost = await Post.findById(post._id)
      .populate("user", "name")
      .populate({
        path: "comments",
        populate: { path: "userId", select: "name" },
      });

    res.status(201).json(populatedPost);
  } catch (err) {
    res.status(500).json({ message: "Error creating post" });
  }
});

//  Get all posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name")
      .populate({
        path: "comments",
        populate: { path: "userId", select: "name" },
      });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

//  Like/unlike post
router.post("/posts/:id/like", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user.id;

    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("user", "name")
      .populate({
        path: "comments",
        populate: { path: "userId", select: "name" },
      });

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Error liking post" });
  }
});

//  Add comment
router.post("/posts/:id/comment", protect, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;

    const comment = await Comment.create({
      userId,
      text,
    });

    const post = await Post.findById(postId);
    post.comments.push(comment._id);
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("user", "name")
      .populate({
        path: "comments",
        populate: { path: "userId", select: "name" },
      });

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Error adding comment" });
  }
});
//  Update Post
router.put("/posts/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    post.content = req.body.content || post.content;
    await post.save();

    const updated = await Post.findById(post._id)
      .populate("user", "name")
      .populate({
        path: "comments",
        populate: { path: "userId", select: "name" },
      });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete Post
router.delete("/posts/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await Comment.deleteMany({ _id: { $in: post.comments } });
    await post.deleteOne();

    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post" });
  }
});
//  Update Comment
router.put("/comments/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    comment.text = req.body.text || comment.text;
    await comment.save();

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: "Error updating comment" });
  }
});

//  Delete Comment
router.delete("/comments/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await Comment.findByIdAndDelete(req.params.id);

    // Remove comment from associated post
    await Post.updateMany({}, { $pull: { comments: req.params.id } });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment" });
  }
});

module.exports = router;
