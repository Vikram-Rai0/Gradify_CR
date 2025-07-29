import express from "express";
const classRoomRouter = express.Router();
import {
  createroom,
  getClassroom,
} from "../controllers/classroom/createClassroom.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { joinClassroom } from "../controllers/classroom/joinClassroom.js";

classRoomRouter.post("/createclass", verifyToken, createroom);
classRoomRouter.get("/getclassroom", verifyToken, getClassroom);
classRoomRouter.post("/joinclass", verifyToken, joinClassroom);

export default classRoomRouter;
