import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"; // ← added for file existence checks
import { errorHandler } from "./middlewares/errormiddleware.js";
import authRoutes from "./routes/authroutes.js";
import postRoutes from "./routes/postroutes.js";
import commentRoutes from "./routes/commentroutes.js";
import adminRoutes from "./routes/adminroutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("[STARTUP] Server file loaded");
console.log("[STARTUP] __dirname:", __dirname);
console.log("[STARTUP] Current working directory (process.cwd()):", process.cwd());

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(
  cors({
    origin: "https://fullstack-blog-1-n5qh.onrender.com", // simplified (no array needed for single origin)
    credentials: true,
  })
);

// Log every incoming request (very helpful for Render)
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.originalUrl} from ${req.ip}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/testing", (req, res) => {
  console.log("[HIT] /api/testing endpoint");
  res.json({ status: "OK", message: "Server is running" });
});

// ───────────────────────────────────────────────
// Frontend serving part – with heavy logging
// ───────────────────────────────────────────────

// Try multiple path variations – pick ONE and comment others
const clientPath = path.join(__dirname, "../../frontend/dist");
// Alternative 1: from repo root (often more reliable on Render)
// const clientPath = path.resolve(process.cwd(), "frontend", "dist");
// Alternative 2:
// const clientPath = path.join(__dirname, "..", "..", "frontend", "dist");

console.log("[PATH] Resolved clientPath:", clientPath);

const indexPath = path.join(clientPath, "index.html");

console.log("[PATH] Resolved index.html path:", indexPath);
console.log("[PATH] Does frontend/dist exist?", fs.existsSync(clientPath) ? "YES" : "NO");
console.log("[PATH] Does index.html exist?", fs.existsSync(indexPath) ? "YES" : "NO");

// Optional: list some files if directory exists (debug only)
if (fs.existsSync(clientPath)) {
  try {
    console.log("[PATH] Files in dist:", fs.readdirSync(clientPath).slice(0, 10)); // first 10 files
  } catch (e) {
    console.log("[PATH] Error reading dist folder:", e.message);
  }
}

// Serve static assets (js, css, images...)
app.use(express.static(clientPath));

// Catch-all for SPA – MUST be after static and API routes
app.get("*", (req, res) => {
  console.log(`[SPA] Catch-all serving index.html for: ${req.originalUrl}`);
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error("[ERROR] sendFile failed:", err.message);
        res.status(500).send("Failed to serve frontend");
      }
    });
  } else {
    console.error("[ERROR] index.html not found at:", indexPath);
    res.status(404).send("Frontend build not found");
  }
});

// Error handler – last
app.use(errorHandler);

console.log("[STARTUP] Express app configured successfully");

export default app;