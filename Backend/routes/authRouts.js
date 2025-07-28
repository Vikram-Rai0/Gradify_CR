import express from "express";
import {
  userSignup,
  userLogin,
  getCurrentUser,
  logoutUser,
} from "../controllers/user/authController.js";
import { validateUser, isAdmin } from "../middlewares/validateUser.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user/userCRUD.js";

const authrouter = express.Router();
authrouter.post("/signup", userSignup);
authrouter.post("/login", userLogin);
authrouter.get("/logout", logoutUser);

// Protected route - user info
authrouter.get("/me", validateUser, getCurrentUser);
authrouter.get("/", validateUser, isAdmin, getAllUsers); // Only admin can list all users
authrouter.get("/:user_id", validateUser, getUserById); // User can get self info, admin can get any
authrouter.put("/:user_id", validateUser, updateUser); // User can update self, admin can update any
authrouter.delete("/:user_id", validateUser, deleteUser); // User can delete self, admin can delete any

export default authrouter;
