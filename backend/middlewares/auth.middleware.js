import User from "../models/user.model.js";
import { verifyToken } from "../utils/token.js";

export const protect = async (req, res, next) => {
  let token = req.cookies.token;
  if (!token) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    token = authHeader.split(" ")[1];
  }
  try {
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
