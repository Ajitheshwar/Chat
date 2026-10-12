import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { notFound } from "../middlewares/notFound.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import mongoose from "mongoose";
import authRoutes from "../routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", db: mongoose.connection.readyState });
});

app.get("/api/boom", (req, res) => {
  throw new Error("Testing error");
});

app.use(notFound);
app.use(errorHandler);

export default app;
