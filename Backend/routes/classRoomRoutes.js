import express from "express";
const classRoomRouter = express.Router();
import {
  countActiveClass,
  createroom,
  fetchClassroomMembers,
  getClassroom,
  getClassroomById,
  updateClassroom,
  deleteClassroom,
  getTeachingClasses,
  removeClassroomMember,
  leaveClassroom,
} from "../controllers/classroom/createClassroom.js";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware.js";
import { joinClassroom } from "../controllers/classroom/joinClassroom.js";
import { ensureClassMember } from "../middlewares/classroomAccess.js";

classRoomRouter.post("/createclass", verifyToken, createroom);
classRoomRouter.get("/getclassroom", verifyToken, getClassroom);
classRoomRouter.get("/teaching", verifyToken, getTeachingClasses);
classRoomRouter.post("/joinclass", verifyToken, joinClassroom);
classRoomRouter.get("/countActiveClasses", verifyToken, countActiveClass);
classRoomRouter.get(
  "/:class_id/fetchClassroomMembers",
  verifyToken,
  ensureClassMember,
  fetchClassroomMembers
);
classRoomRouter.delete(
  "/:classId/members/:userId",
  verifyToken,
  removeClassroomMember
);
classRoomRouter.post("/:classId/leave", verifyToken, leaveClassroom);
classRoomRouter.put("/:classId", verifyToken, updateClassroom);
classRoomRouter.delete("/:classId", verifyToken, isAdmin, deleteClassroom);
classRoomRouter.get("/:classId", verifyToken, ensureClassMember, getClassroomById);

export default classRoomRouter;
