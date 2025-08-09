import express from "express";
import {
  postAssignment,
  getAssignment,
  getSingleAssignment
} from "../controllers/classwork/assignment.js";
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

classworkRouter.get("/:class_id/getAssignment", verifyToken, getAssignment);
classworkRouter.get("/:class_id/getAssignment/:assignment_id", verifyToken,getSingleAssignment);


export default classworkRouter;
