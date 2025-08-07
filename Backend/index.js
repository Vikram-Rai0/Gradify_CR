import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authrouter from "./routes/authRouts.js";
import classRoomRouter from "./routes/classRoomRoutes.js";
import announceRouter from "./routes/announcementRouter.js";
import classworkRouter from "./routes/classworkRouter.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// Middleware
app.use(express.json()); // Required to parse JSON body
app.use(cookieParser());

// Base route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Mount user routes
app.use("/api/user", authrouter);
app.use("/api/announcement", announceRouter);
app.use("/api/classroom", classRoomRouter);
app.use("/api/classwork", classworkRouter);
app.use('/uploads', express.static('uploads'));
// app.use('/api/auth', authRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
