import express from "express";
import {
  getAllUsers,
  userSignup,
  userLogin,
  selectUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  logoutUser,
} from "../controllers/userControllers.js";
import { verifyUser } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/validateUser.js";

const router = express.Router();

router.get("/", verifyUser, isAdmin, getAllUsers);
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/me", verifyUser, getCurrentUser);
router.get("/logout", logoutUser);
router.get("/:user_id", selectUser);
router.put("/:user_id", updateUser);
router.delete("/:user_id", isAdmin, deleteUser);

export default router;
