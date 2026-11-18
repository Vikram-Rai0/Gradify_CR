import express from "express";
import {
  postAnnouncement,
  getAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
} from "../controllers/announcement.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { ensureClassMember } from "../middlewares/classroomAccess.js";

const announceRouter = express.Router();

announceRouter.post("/postannouncement", verifyToken, ensureClassMember, postAnnouncement);
announceRouter.get(
  "/getannouncement/:classId",
  verifyToken,
  ensureClassMember,
  getAnnouncement
);
announceRouter.put("/:id", verifyToken, updateAnnouncement);
announceRouter.delete("/:id", verifyToken, deleteAnnouncement);

export default announceRouter;
