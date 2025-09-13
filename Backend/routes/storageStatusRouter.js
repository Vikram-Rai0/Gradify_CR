import express from "express";
import { databaseHealth } from "../controllers/dashboard/dResourcesStatus.js";
export const resourceStatusRouter = express.Router();

resourceStatusRouter.get("/db-health", databaseHealth)