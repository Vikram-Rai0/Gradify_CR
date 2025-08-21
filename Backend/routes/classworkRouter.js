// routes/classworkRouter.js
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
import { 
  getAssignUser,
  getStudentSubmission,
  handleAssignmentAction,
  handleBulkAction
} from "../controllers/classwork/studentWork.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import multer from "multer";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/submissions/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Add file type restrictions if needed
    cb(null, true);
  }
});

const assignmentUpload = multer({ dest: "uploads/assignments/" });
const classworkRouter = express.Router();

// Assignment creation routes
classworkRouter.post(
  "/:class_id/postAssignment",
  verifyToken,
  assignmentUpload.array("attachments"),
  postAssignment
);

classworkRouter.get("/:class_id/getAssignment", verifyToken, getAssignment);

classworkRouter.get(
  "/:class_id/getAssignment/:assign_id",
  verifyToken,
  getSingleAssignment
);

// Student submission routes
classworkRouter.post(
  "/:classId/submitAssignment/:assignId",
  verifyToken,
  upload.array("attachments"), // Handle multiple files
  submitAssignment
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

// Instructor review routes
classworkRouter.get(
  "/:classId/assignment/:assignId/assignUser",
  verifyToken,
  getAssignUser
);

classworkRouter.get(
  "/:classId/assignment/:assignId/student/:studentId",
  verifyToken,
  getStudentSubmission
);

classworkRouter.post(
  "/:classId/assignment/:assignId/action",
  verifyToken,
  handleAssignmentAction
);

classworkRouter.post(
  "/:classId/assignment/:assignId/bulk-action",
  verifyToken,
  handleBulkAction
);

export default classworkRouter;