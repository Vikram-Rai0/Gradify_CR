import express from "express";
import {
  getAllUsers,
  userSignup,
  userLogin,
  selectUser,
  updateUser,
  deleteUser,
} from "../controllers/userControllers.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/:user_id", selectUser);
router.put("/:user_id", updateUser);
router.delete("/:user_id", deleteUser);

export default router;
