import express from "express";
import {
  postAnnouncement,
  getAnnouncement,
} from "../controllers/announcement.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const announceRouter = express.Router();

announceRouter.post(
  "/postannouncement",
  verifyToken,
  (req, res, next) => {
    console.log("Announcement POST request received");
    next();
  },
  postAnnouncement
);
// announceRouter.get("/announcements/:class_id", verifyToken, (req, res, next) => {
//   console.log(`Fetching announcements for class: ${req.params.class_id}`);
//   next();
// }, getAnnouncement);

// In server/routes/announcement.js
announceRouter.get("getannouncementsByClasses/class/:classId", verifyToken, (req, res, next) => {
  console.log(`Fetching announcements for class: ${req.params.classId}`);
  next();
}, getAnnouncement);

export default announceRouter;
