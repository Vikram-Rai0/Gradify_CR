import express from "express";
const userRouter = express.Router();
import { isAdmin } from "../middlewares/authMiddleware.js";
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
} from "../controllers/user/userCRUD.js";
import { verifyToken } from "../middlewares/authMiddleware.js";


// Protected route - user info

userRouter.get("/totalUserCount", verifyToken, countUsers);
userRouter.get("/totalInstructorCount", verifyToken, totalInstructor);
userRouter.get("/totalStudentCount", verifyToken, totalStudent);
userRouter.get("/totalSupervisorCount", verifyToken, totalSupervisor);
userRouter.get("/me", verifyToken, getCurrentUser);
userRouter.get("/getallusers", verifyToken, isAdmin, getAllUsers); // Only admin can list all users
userRouter.get("/:user_id", verifyToken, getUserById); // User can get self info, admin can get any
userRouter.put("/:user_id", verifyToken, updateUser); // User can update self, admin can update any
userRouter.delete("/:user_id", verifyToken, deleteUser); // User can delete self, admin can delete any
userRouter.patch("/:user_id/toggleStatus", verifyToken, isAdmin, toggleUserStatus)
export default userRouter;
