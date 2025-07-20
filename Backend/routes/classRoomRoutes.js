import express from "express";
const classRoomRouter = express.Router();
import { createroom, getClassroom } from "../controllers/createClassroom.js";

classRoomRouter.post("/createclass", createroom);
classRoomRouter.get("/getclassroom", getClassroom);

export default classRoomRouter;
