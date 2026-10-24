const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// Get a public profile by username
router.get("/:username", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.username, u.bio, u.avatar_url,
        (SELECT COUNT(*) FROM follows
         WHERE following_id = u.id) AS followers_count,
        (SELECT COUNT(*) FROM follows
         WHERE follower_id = u.id) AS following_count,
        (SELECT COUNT(*) FROM posts
         WHERE user_id = u.id) AS posts_count
       FROM users u WHERE u.username = $1`,
      [req.params.username.toLowerCase()]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Unable to load profile." });
  }
});

// Follow or unfollow a user
router.post("/:id/follow", auth, async (req, res) => {
  const targetId = Number(req.params.id);

  if (!Number.isInteger(targetId) || targetId < 1) {
    return res.status(400).json({ message: "Invalid user ID." });
  }

  if (targetId === req.user.id) {
    return res.status(400).json({
      message: "You cannot follow yourself."
    });
  }

  try {
    const target = await pool.query(
      "SELECT id FROM users WHERE id = $1",
      [targetId]
    );

    if (!target.rows.length) {
      return res.status(404).json({ message: "User not found." });
    }

    const existing = await pool.query(
      "SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2",
      [req.user.id, targetId]
    );

    let following;

    if (existing.rows.length) {
      await pool.query(
        "DELETE FROM follows WHERE follower_id = $1 AND following_id = $2",
        [req.user.id, targetId]
      );
      following = false;
    } else {
      await pool.query(
        "INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)",
        [req.user.id, targetId]
      );
      following = true;
    }

    res.json({ following });
  } catch (error) {
    res.status(500).json({ message: "Unable to update follow status." });
  }
});

// Edit your own profile
router.patch("/me/profile", auth, async (req, res) => {
  try {
    const { name, bio, avatar_url } = req.body;

    if (
      (name !== undefined &&
       (typeof name !== "string" || !name.trim() || name.length > 100)) ||
      (bio !== undefined &&
       (typeof bio !== "string" || bio.length > 300)) ||
      (avatar_url !== undefined &&
       (typeof avatar_url !== "string" || avatar_url.length > 2048))
    ) {
      return res.status(400).json({ message: "Invalid profile details." });
    }

    const result = await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           bio = COALESCE($2, bio),
           avatar_url = COALESCE($3, avatar_url)
       WHERE id = $4
       RETURNING id, name, username, email, bio, avatar_url`,
      [
        name === undefined ? null : name.trim(),
        bio === undefined ? null : bio,
        avatar_url === undefined ? null : avatar_url,
        req.user.id
      ]
    );

    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Unable to update profile." });
  }
});

module.exports = router;