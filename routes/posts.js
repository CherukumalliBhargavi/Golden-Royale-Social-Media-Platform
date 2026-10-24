const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// Public feed
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.content, p.image_url, p.product_name,
             p.product_price, p.created_at,
             u.id AS user_id, u.name, u.username, u.avatar_url,
             (SELECT COUNT(*) FROM likes l
              WHERE l.post_id = p.id) AS likes_count,
             (SELECT COUNT(*) FROM comments c
              WHERE c.post_id = p.id) AS comments_count
      FROM posts p
      JOIN users u ON u.id = p.user_id
      ORDER BY p.created_at DESC
      LIMIT 100
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Unable to load posts." });
  }
});

// Create a post or product post
router.post("/", auth, async (req, res) => {
  try {
    const {
      content = "",
      image_url = "",
      product_name = null,
      product_price = null
    } = req.body;

    if (typeof content !== "string" ||
        typeof image_url !== "string" ||
        content.length > 5000) {
      return res.status(400).json({
        message: "Invalid post content."
      });
    }

    if (!content.trim() && !image_url.trim()) {
      return res.status(400).json({
        message: "Add some text or an image to your post."
      });
    }

    if (image_url.length > 2048) {
      return res.status(400).json({
        message: "Image URL is too long."
      });
    }

    if (product_price != null &&
        (!Number.isFinite(Number(product_price)) ||
         Number(product_price) < 0)) {
      return res.status(400).json({
        message: "Enter a valid product price."
      });
    }

    const result = await pool.query(
      `INSERT INTO posts
       (user_id, content, image_url, product_name, product_price)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        req.user.id,
        content.trim(),
        image_url.trim(),
        product_name?.trim() || null,
        product_price ?? null
      ]
    );

    res.status(201).json({
      message: "Post published.",
      post: result.rows[0]
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Unable to publish post." });
  }
});

// Like or unlike a post
router.post("/:id/like", auth, async (req, res) => {
  const postId = Number(req.params.id);

  if (!Number.isInteger(postId) || postId < 1) {
    return res.status(400).json({ message: "Invalid post ID." });
  }

  try {
    const post = await pool.query(
      "SELECT id FROM posts WHERE id = $1",
      [postId]
    );

    if (!post.rows.length) {
      return res.status(404).json({ message: "Post not found." });
    }

    const existing = await pool.query(
      "SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2",
      [req.user.id, postId]
    );

    let liked;

    if (existing.rows.length) {
      await pool.query(
        "DELETE FROM likes WHERE user_id = $1 AND post_id = $2",
        [req.user.id, postId]
      );
      liked = false;
    } else {
      await pool.query(
        "INSERT INTO likes (user_id, post_id) VALUES ($1, $2)",
        [req.user.id, postId]
      );
      liked = true;
    }

    const count = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE post_id = $1",
      [postId]
    );

    res.json({ liked, likes_count: Number(count.rows[0].count) });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Unable to update like." });
  }
});

// List comments
router.get("/:id/comments", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.content, c.created_at,
              u.id AS user_id, u.name, u.username, u.avatar_url
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.post_id = $1
       ORDER BY c.created_at ASC`,
      [req.params.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Unable to load comments." });
  }
});

// Add a comment
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const content = req.body.content;

    if (typeof content !== "string" ||
        !content.trim() ||
        content.trim().length > 1000) {
      return res.status(400).json({
        message: "Comment must contain 1–1000 characters."
      });
    }

    const result = await pool.query(
      `INSERT INTO comments (user_id, post_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, req.params.id, content.trim()]
    );

    res.status(201).json({
      message: "Comment added.",
      comment: result.rows[0]
    });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(500).json({ message: "Unable to add comment." });
  }
});

// Delete your own post
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        message: "Post not found or you do not own it."
      });
    }

    res.json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete post." });
  }
});

module.exports = router;