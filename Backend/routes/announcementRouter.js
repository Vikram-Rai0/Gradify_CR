import express from "express";
import {
  postAnnouncement,
  getAnnouncement,
} from "../controllers/announcement.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const announceRouter = express.Router();

announceRouter.post(
  "/announcements",
  verifyToken,
  (req, res, next) => {
    console.log("Announcement POST request received");
    next();
  },
  postAnnouncement
);
announceRouter.get("/announcements", verifyToken, getAnnouncement);

export default announceRouter;
