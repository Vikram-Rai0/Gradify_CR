// routes/userRoutes.js
import express from "express";
import {
  deleteUser,
  updateUser,
  selectUser,
  selectAllUser,
  userLogin,
  userSignup,
} from "../controllers/userControllers.js";

const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);

// Define GET and POST routes
router.get("/", selectAllUser);
router.get("/:user_id", selectUser);
router.delete("/:user_id", deleteUser);
router.put("/:user_id", updateUser);



export default router;
