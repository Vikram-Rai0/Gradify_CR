import fs from "fs";
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authrouter from "./routes/authRouts.js";
import classRoomRouter from "./routes/classRoomRoutes.js";
import announceRouter from "./routes/announcementRouter.js";
import classworkRouter from "./routes/classworkRouter.js";
import { resourceStatusRouter } from "./routes/storageStatusRouter.js";
import userRouter from "./routes/userRoute.js";
import calendarRouter from "./routes/calendarRouter.js";
import notificationRouter from "./routes/notificationRouter.js";

dotenv.config();

["uploads", "uploads/submissions", "uploads/assignments", "uploads/materials"].forEach(
  (dir) => fs.mkdirSync(path.join(process.cwd(), dir), { recursive: true })
);

const app = express();
const PORT = process.env.PORT || 5000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "Gradify Classroom API" });
});

app.use("/api/system", resourceStatusRouter);
app.use("/api/authverify", authrouter);
app.use("/api/user", userRouter);
app.use("/api/announcement", announceRouter);
app.use("/api/classroom", classRoomRouter);
app.use("/api/classwork", classworkRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/notifications", notificationRouter);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File is too large" });
  }
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
