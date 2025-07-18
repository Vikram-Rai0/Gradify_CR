import express from "express";
const classRoomRouter = express.Router();
import { createroom } from "../controllers/createClassroom.js";

classRoomRouter.post("/createclass", createroom);

export default classRoomRouter;
