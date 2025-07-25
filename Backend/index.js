import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import classRoomRouter from "./routes/classRoomRoutes.js";
import announceRouter from "./routes/announcementRouter.js";
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
app.use("/api", announceRouter);
app.use("/api/user", userRoutes);
app.use("/api", classRoomRouter);
// app.use('/api/auth', authRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
