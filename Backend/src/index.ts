import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./db";
import authRoutes from "./routes/auth"
import applicationRoutes from "./routes/applications";
import aiRoutes from "./routes/ai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.send("job tracker server ok");
});

app.use("/auth", authRoutes);
app.use("/applications", applicationRoutes);
app.use("/ai", aiRoutes);

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  })
  .catch((err) => {
    console.error("DB failed", err);
    process.exit(1);
  });
