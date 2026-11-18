import express from "express";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  countUsers,
  getCurrentUser,
  totalStudent,
  totalSupervisor,
  totalInstructor,
  toggleUserStatus,
  createUserByAdmin,
  getDashboardStats,
} from "../controllers/user/userCRUD.js";
import { changePassword, forgotPassword, resetPassword } from "../controllers/user/authController.js";

const userRouter = express.Router();

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

userRouter.get("/totalUserCount", verifyToken, countUsers);
userRouter.get("/totalInstructorCount", verifyToken, totalInstructor);
userRouter.get("/totalStudentCount", verifyToken, totalStudent);
userRouter.get("/totalSupervisorCount", verifyToken, totalSupervisor);
userRouter.get("/stats", verifyToken, isAdmin, getDashboardStats);
userRouter.get("/me", verifyToken, getCurrentUser);
userRouter.put("/me/password", verifyToken, changePassword);
userRouter.get("/getallusers", verifyToken, isAdmin, getAllUsers);
userRouter.post("/", verifyToken, isAdmin, createUserByAdmin);
userRouter.get("/:user_id", verifyToken, getUserById);
userRouter.put("/:user_id", verifyToken, updateUser);
userRouter.delete("/:user_id", verifyToken, deleteUser);
userRouter.patch("/:user_id/toggleStatus", verifyToken, isAdmin, toggleUserStatus);

export default userRouter;
