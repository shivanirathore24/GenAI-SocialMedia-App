import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// auth routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

export default app;