import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Not authorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.isBlocked) {
      return res.status(403).json({
        message: "User blocked or not found",
      });
    }
    req.user = {
      id: user._id,
      role: user.role,
    };
    next();
  } catch {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};
