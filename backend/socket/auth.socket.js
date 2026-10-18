import { parseCookie } from "cookie";
import User from "../models/user.model.js";
import { verifyToken } from "../utils/token.js";

export const socketAuth = async (socket, next) => {
  try {
    const rawCookies = socket.handshake.headers.cookie || "";
    const cookies = parseCookie(rawCookies);

    const token = cookies.token;
    if (!token) return next(new Error("Unauthorized"));

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) return next(new Error("Unauthorized"));

    socket.user = user;
    next();
  } catch (err) {
    next(new Error(`Authentication Error: ${err}`));
  }
};
