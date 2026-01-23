import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"; // for debug checks
import { errorHandler } from "./middlewares/errormiddleware.js";
import authRoutes from "./routes/authroutes.js";
import postRoutes from "./routes/postroutes.js";
import commentRoutes from "./routes/commentroutes.js";
import adminRoutes from "./routes/adminroutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("[STARTUP] Server file loaded");
console.log("[STARTUP] __dirname:", __dirname);
console.log("[STARTUP] process.cwd():", process.cwd());

// Use repo root + relative path – reliable on Render
const clientPath = path.resolve(process.cwd(), "..", "frontend", "dist");
// Alternative if above fails: path.join(process.cwd(), "../frontend/dist");

console.log("[PATH] Resolved clientPath:", clientPath);

const indexPath = path.join(clientPath, "index.html");
console.log("[PATH] Resolved index.html:", indexPath);
console.log("[PATH] dist folder exists?", fs.existsSync(clientPath) ? "YES" : "NO");
console.log("[PATH] index.html exists?", fs.existsSync(indexPath) ? "YES" : "NO");

if (fs.existsSync(clientPath)) {
  console.log("[PATH] Sample files in dist:", fs.readdirSync(clientPath).slice(0, 8));
}

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: "https://fullstack-blog-1-n5qh.onrender.com",
    credentials: true,
  })
);

// Log requests for debug
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/testing", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Static files FIRST (after APIs)
app.use(express.static(clientPath));

// Catch-all SPA route – Express 5 compatible (named wildcard)
// Use /{*path} to catch everything including /
app.get("/{*path}", (req, res) => {
  console.log(`[SPA] Serving index.html for: ${req.originalUrl} (params.path: ${req.params.path})`);
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error("[ERROR] sendFile failed:", err);
        res.status(500).send("Failed to load app");
      }
    });
  } else {
    console.error("[ERROR] index.html missing!");
    res.status(404).send("Frontend not built or missing");
  }
});

// Error handler last
app.use(errorHandler);

console.log("[STARTUP] App configured – ready to listen");

export default app;