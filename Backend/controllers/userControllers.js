import db from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

export const getusers = (req, res) => {
  db.query("SELECT * FROM user", (err, results) => {
    if (err) return res.status(500).send({ error: err.message });
    res.json(results);
  });
};
// ===========================================================================================================================
// User SignUp

export const userSignup = (req, res) => {
  const { name, email, password, role } = req.body;

  // Validation
  if (!name) return res.status(400).json({ error: "Name is required" });
  if (!email) return res.status(400).json({ error: "Email is required" });
  if (!password) return res.status(400).json({ error: "Password is required" });
  if (!role) return res.status(400).json({ error: "Role is required" });

  // Check if user already exists
  db.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("Database select error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert new user
        db.query(
          "INSERT INTO user (name, email, role, password_hash, verified) VALUES (?, ?, ?, ?, ?)",
          [name, email, role, password_hash, 0], // Use 0 for false (MySQL boolean)
          (err, result) => {
            if (err) {
              console.error("Database insert error:", err);
              return res.status(500).json({ error: "Failed to create user" });
            }
            // Generate a JWT token with email payload
            const token = jwt.sign({ email }, "asdflkj");

            // Set the token as an HTTP-only cookie
            res.cookie("token", token, {
              httpOnly: true,
              secure: false, // Set to true in production with HTTPS
              sameSite: "lax", // more lenient for development
            });

            return res.json({ message: "User created", id: result.insertId });
          }
        );
      } catch (error) {
        console.error("Signup process error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );
};

// ================================================================================================================================================
// Login user
export const userLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  db.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.length === 0) {
        return res.status(401).json({ message: "Invalid email or password!" });
      }

      const user = result[0];

      const storedPassword = user.password || user.password_hash;

      if (!storedPassword) {
        return res
          .status(500)
          .json({ message: "Stored password is missing for user" });
      }

      const isMatch = await bcrypt.compare(password, storedPassword);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Set the token as an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: "lax", // more lenient for development
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
    }
  );
};

// ========================================================================================================================================
//GET all user
export const selectAllUser = (req, res) => {
  const selectAllQuery = "SELECT * FROM user";
  db.query(selectAllQuery, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "User not Found!" });
    res.status(200).json(result);
  });
};

// ===============================================================================================================================================
//Get single user by userId
export const selectUser = (req, res) => {
  const userId = req.params.user_id;
  const individualQuery = "SELECT * FROM user WHERE user_id = ?";
  db.query(individualQuery, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "User not Found!" });
    res.status(200).json(result[0]);
  });
};

// =======================================================================================================================================
//Update Users by userID
export const updateUser = (req, res) => {
  const userId = req.params.user_id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  const { name, role, email, password_hash } = req.body;

  const userQuery =
    "UPDATE user SET name= ?, role = ?, email = ?, password_hash = ? WHERE user_id = ?";

  db.query(
    userQuery,
    [name, email, role, password_hash, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "User not found" });
      res.status(200).json({ message: "User Updated" });
    }
  );
};

// =============================================================================================================================================
//Delet user by userID

export const deleteUser = (req, res) => {
  const userId = req.params.user_id;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  db.query("DELETE FROM user WHERE user_id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User Not Found" });
    res.status(200).json({ message: "User deleted" });
  });
};
