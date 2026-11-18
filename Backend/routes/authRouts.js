import express from "express";
import {
  userSignup,
  userLogin,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/user/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const authrouter = express.Router();
authrouter.post("/signup", userSignup);
authrouter.post("/login", userLogin);
authrouter.post("/forgot-password", forgotPassword);
authrouter.post("/reset-password", resetPassword);
authrouter.get("/logout", verifyToken, logoutUser);

export default authrouter;
