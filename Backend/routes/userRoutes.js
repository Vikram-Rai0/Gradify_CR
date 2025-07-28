import express from "express";
import {
  userSignup,
  userLogin,
  getCurrentUser,
  logoutUser,
} from "../controllers/user/authController.js";
import { verifyToken, isAdmin } from "../middlewares/validateUser.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user/userCRUD.js";

const router = express.Router();
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/logout", logoutUser);

// Protected route - user info
router.get("/me", verifyToken, getCurrentUser);
router.get("/", verifyToken, isAdmin, getAllUsers); // Only admin can list all users
router.get("/:user_id", verifyToken, getUserById); // User can get self info, admin can get any
router.put("/:user_id", verifyToken, updateUser); // User can update self, admin can update any
router.delete("/:user_id", verifyToken, deleteUser); // User can delete self, admin can delete any

export default router;
