import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

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
  } catch (error) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};
