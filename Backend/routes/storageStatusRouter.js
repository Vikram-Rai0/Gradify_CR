import express from "express";
import { databaseHealth } from "../controllers/dashboard/dResourcesStatus.js";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware.js";

export const resourceStatusRouter = express.Router();
resourceStatusRouter.get("/db-health", verifyToken, isAdmin, databaseHealth);
