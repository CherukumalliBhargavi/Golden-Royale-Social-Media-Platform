const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
}

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (
      !name?.trim() ||
      !username?.trim() ||
      !email?.trim() ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Please complete all required fields."
      });
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        message: "Password must contain 8–72 characters."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    if (!/^[a-z0-9_]{3,40}$/.test(normalizedUsername)) {
      return res.status(400).json({
        message: "Username must be 3–40 letters, numbers, or underscores."
      });
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [normalizedEmail, normalizedUsername]
    );

    if (existing.rows.length) {
      return res.status(409).json({
        message: "Email or username is already registered."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (name, username, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, username, email, bio, avatar_url`,
      [
        name.trim(),
        normalizedUsername,
        normalizedEmail,
        passwordHash
      ]
    );

    const user = result.rows[0];

    res.status(201).json({
      message: "Account created successfully.",
      token: createToken(user),
      user
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Email or username is already registered."
      });
    }

    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Unable to register." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Enter your email and password."
      });
    }

    const result = await pool.query(
      `SELECT id, name, username, email, password_hash,
              bio, avatar_url
       FROM users WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    const user = result.rows[0];

    if (
      !user ||
      !(await bcrypt.compare(password, user.password_hash))
    ) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    delete user.password_hash;

    res.json({
      message: "Login successful.",
      token: createToken(user),
      user
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Unable to log in." });
  }
});

module.exports = router;