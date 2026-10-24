require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("Set a strong JWT_SECRET in your .env file.");
}

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/users", require("./routes/users"));

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({
      status: "error",
      database: "disconnected"
    });
  }
});

// Serve your existing frontend folder
const frontendDir = path.resolve(__dirname, "../Frontend");

if (fs.existsSync(frontendDir)) {
  app.use(express.static(frontendDir));

  app.get("/", (req, res) => {
    res.sendFile(path.join(frontendDir, "index.html"));
  });
} else {
  console.warn("Frontend folder not found:", frontendDir);
}

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connection successful.");

    app.listen(PORT, () => {
      console.log(`Golden Social running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();