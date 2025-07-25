import db from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from 'cookie-parser';

// ======================== Signup ========================
export const userSignup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [existingUser] = await db.query(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      "INSERT INTO user (name, email, role, password_hash, verified) VALUES (?, ?, ?, ?, ?)",
      [name, email, role, password_hash, 0]
    );
    const userId = result.user_id;
    console.log(userId);

    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(201).json({ message: "User created", id: result.userId });
  } catch (err) {
    console.error("Signup error:", err); // <-- Add this
    res
      .status(500)
      .json({ error: "Internal server error", detail: err.message });
  }
};

// ======================== Login ========================
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const [result] = await db.query("SELECT * FROM user WHERE email = ?", [
      email,
    ]);

    if (result.length === 0)
      return res.status(401).json({ message: "Invalid email or password!" });

    const user = result[0];
    const storedPassword = user.password_hash;

    if (!storedPassword)
      return res.status(500).json({ message: "User password is missing" });

    const isMatch = await bcrypt.compare(password, storedPassword);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================== Get Logged-In User ========================
export const getCurrentUser = async (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // <--- Add this
    const [result] = await db.query(
      "SELECT user_id, name, email, role FROM user WHERE user_id = ?",
      [decoded.id]
    );

    if (result.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(result[0]);
  } catch (err) {
    console.error("Token error:", err.message);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

// ======================== Get All Users ========================
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM user");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ======================== Get Single User ========================
export const selectUser = async (req, res) => {
  const userId = req.params.user_id;

  try {
    const [result] = await db.query("SELECT * FROM user WHERE user_id = ?", [
      userId,
    ]);

    if (result.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================== Update User ========================
export const updateUser = async (req, res) => {
  const userId = req.params.user_id;
  const { name, role, email, password } = req.body;

  if (!userId) return res.status(400).json({ error: "User ID is required" });

  try {
    const password_hash = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const [result] = await db.query(
      "UPDATE user SET name = ?, role = ?, email = ?, password_hash = ? WHERE user_id = ?",
      [name, role, email, password_hash, userId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================== Delete User ========================
export const deleteUser = async (req, res) => {
  const userId = req.params.user_id;

  if (!userId) return res.status(400).json({ error: "User ID is required" });

  try {
    const [result] = await db.query("DELETE FROM user WHERE user_id = ?", [
      userId,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout


export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
