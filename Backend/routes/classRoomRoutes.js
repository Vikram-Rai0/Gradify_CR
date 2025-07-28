import express from "express";
const classRoomRouter = express.Router();
import { createroom, getClassroom } from "../controllers/createClassroom.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

classRoomRouter.post("/createclass", verifyToken, createroom);
classRoomRouter.get("/getclassroom", getClassroom);

export default classRoomRouter;
