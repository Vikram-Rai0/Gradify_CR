import express from "express";
import { postAnnouncement } from "../controllers/announcement.js";

const announceRouter = express.Router();

announceRouter.post("/announcements", postAnnouncement);

export default announceRouter;
