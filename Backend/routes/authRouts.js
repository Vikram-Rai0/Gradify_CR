import express from "express";
import {
  userSignup,
  userLogin,
  getCurrentUser,
  logoutUser,
} from "../controllers/user/authController.js";
import { isAdmin } from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  countUsers,
  totalStudent,
  totalSupervisor,
  totalInstructor,
} from "../controllers/user/userCRUD.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const authrouter = express.Router();
authrouter.post("/signup", userSignup);
authrouter.post("/login", userLogin);
authrouter.get("/logout", logoutUser);

// Protected route - user info
authrouter.get('/totalUserCount', verifyToken, countUsers)
authrouter.get('/totalInstructorCount', verifyToken, totalInstructor)
authrouter.get('/totalStudentCount', verifyToken, totalStudent)
authrouter.get('/totalSupervisorCount', verifyToken, totalSupervisor)
authrouter.get("/me", verifyToken, getCurrentUser);
authrouter.get("/getallusers", verifyToken, isAdmin, getAllUsers); // Only admin can list all users
authrouter.get("/:user_id", verifyToken, getUserById); // User can get self info, admin can get any
authrouter.put("/:user_id", verifyToken, updateUser); // User can update self, admin can update any
authrouter.delete("/:user_id", verifyToken, deleteUser); // User can delete self, admin can delete any

export default authrouter;
