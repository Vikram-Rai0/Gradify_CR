import express from "express";
const classRoomRouter = express.Router();
import {
  countActiveClass,
  createroom,
  fetchClassroomMembers,
  getClassroom,
} from "../controllers/classroom/createClassroom.js";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware.js";
import { joinClassroom } from "../controllers/classroom/joinClassroom.js";

classRoomRouter.post("/createclass", verifyToken, createroom);
classRoomRouter.get("/getclassroom", verifyToken, getClassroom);
classRoomRouter.post("/joinclass", verifyToken, joinClassroom);
classRoomRouter.get("/countActiveClasses",verifyToken,countActiveClass)
classRoomRouter.get(
  "/:class_id/fetchClassroomMembers",
  verifyToken,
  fetchClassroomMembers
);

export default classRoomRouter;
