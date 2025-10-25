import express from "express";
import {
  userSignup,
  userLogin,
  logoutUser,
} from "../controllers/user/authController.js";

// auth router
const authrouter = express.Router();
authrouter.post("/signup", userSignup);
authrouter.post("/login", userLogin);
authrouter.get("/logout", logoutUser);


export default authrouter;
