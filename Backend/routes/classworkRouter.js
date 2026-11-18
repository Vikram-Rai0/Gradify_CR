import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import {
  postAssignment,
  getAssignment,
  getSingleAssignment,
  deleteAssignment,
  reuseAssignment,
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
  handleBulkAction,
} from "../controllers/classwork/studentWork.js";
import { postMaterial, getMaterials, deleteMaterial } from "../controllers/classwork/material.js";
import { createTopic, getTopics, deleteTopic } from "../controllers/classwork/topic.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { ensureClassMember } from "../middlewares/classroomAccess.js";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function diskStorage(subdir) {
  const dest = path.join(process.cwd(), "uploads", subdir);
  ensureDir(dest);
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname) || "";
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
}

const upload = multer({
  storage: diskStorage("submissions"),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const assignmentUpload = multer({
  storage: diskStorage("assignments"),
  limits: { fileSize: 20 * 1024 * 1024 },
});

const materialUpload = multer({
  storage: diskStorage("materials"),
  limits: { fileSize: 25 * 1024 * 1024 },
});

const classworkRouter = express.Router();

classworkRouter.post(
  "/:class_id/postAssignment",
  verifyToken,
  ensureClassMember,
  assignmentUpload.array("attachments"),
  postAssignment
);

classworkRouter.get("/:class_id/getAssignment", verifyToken, ensureClassMember, getAssignment);

classworkRouter.get(
  "/:class_id/getAssignment/:assign_id",
  verifyToken,
  ensureClassMember,
  getSingleAssignment
);

classworkRouter.post(
  "/:class_id/reuseAssignment",
  verifyToken,
  ensureClassMember,
  reuseAssignment
);

classworkRouter.post(
  "/:classId/submitAssignment/:assignId",
  verifyToken,
  ensureClassMember,
  upload.array("attachments"),
  submitAssignment
);

classworkRouter.get(
  "/:classId/assignment/:assignId/getmySubmission",
  verifyToken,
  ensureClassMember,
  getMySubmission
);

classworkRouter.delete(
  "/:classId/unsubmitAssignment/:assignId",
  verifyToken,
  ensureClassMember,
  unsubmitAssignment
);

classworkRouter.get("/assignment/:assignId/assignUser", verifyToken, getAssignUser);

classworkRouter.get(
  "/:classId/assignment/:assignId/student/:studentId",
  verifyToken,
  ensureClassMember,
  getStudentSubmission
);

classworkRouter.post(
  "/:classId/assignment/:assignId/action",
  verifyToken,
  ensureClassMember,
  handleAssignmentAction
);

classworkRouter.post(
  "/:classId/assignment/:assignId/bulk-action",
  verifyToken,
  ensureClassMember,
  handleBulkAction
);

classworkRouter.delete("/:assign_id/deletAssignment", verifyToken, deleteAssignment);

classworkRouter.post(
  "/:class_id/material",
  verifyToken,
  ensureClassMember,
  materialUpload.single("file"),
  postMaterial
);
classworkRouter.get("/:class_id/material", verifyToken, ensureClassMember, getMaterials);
classworkRouter.delete("/material/:material_id", verifyToken, deleteMaterial);

classworkRouter.post("/:class_id/topic", verifyToken, ensureClassMember, createTopic);
classworkRouter.get("/:class_id/topic", verifyToken, ensureClassMember, getTopics);
classworkRouter.delete("/topic/:topic_id", verifyToken, deleteTopic);

export default classworkRouter;
