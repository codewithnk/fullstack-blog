import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errormiddleware.js";
import authRoutes from "./routes/authroutes.js";
import postRoutes from "./routes/postroutes.js";
import commentRoutes from "./routes/commentroutes.js";
import adminRoutes from "./routes/adminroutes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/testing", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});
app.use(errorHandler);

export default app;
