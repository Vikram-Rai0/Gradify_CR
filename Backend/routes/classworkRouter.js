import express from "express";
import {
  postAssignment,
  getAssignment,
  getSingleAssignment,
} from "../controllers/classwork/assignment.js";
import {
  submitAssignment,
  getMySubmission,
  unsubmitAssignment,
} from "../controllers/classwork/assignmentSubmission.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import multer from "multer";
import { getAssignUser } from "../controllers/classwork/studentWrok.js";

const upload = multer({ dest: "uploads/assignments/" });
const classworkRouter = express.Router();

classworkRouter.post(
  "/:class_id/postAssignment",
  verifyToken,
  upload.array("attachments"), // Handle file uploads
  postAssignment
);

classworkRouter.get("/:class_id/getAssignment", verifyToken, getAssignment);

classworkRouter.get(
  "/:class_id/getAssignment/:assign_id",
  verifyToken,
  getSingleAssignment
);

classworkRouter.post(
  "/:classId/submitAssignment/:assignId",
  verifyToken,
  upload.array("attachments"), // multiple files
  submitAssignment
);

classworkRouter.get(
  "/:classId/assignment/:assignId/assignUser",
  verifyToken,
  getAssignUser
);

classworkRouter.get(
  "/:classId/assignment/:assignId/getmySubmission",
  verifyToken,
  getMySubmission
);

classworkRouter.delete(
  "/:classId/unsubmitAssignment/:assignId",
  verifyToken,
  unsubmitAssignment
);

export default classworkRouter;
