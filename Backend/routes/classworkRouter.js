import express from "express";
import { postAssignment } from "../controllers/classwork/assignment.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/assignments/" });
const classworkRouter = express.Router();

classworkRouter.post(
  "/:class_id/postAssignment",
  verifyToken,
  upload.array("attachments"), // Handle file uploads
  postAssignment
);

export default classworkRouter;
