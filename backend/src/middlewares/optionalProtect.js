// optionalProtect.js
import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";

export const optionalProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (err) {
      // ignore invalid token
      req.user = null;
    }
  }
  next();
};
