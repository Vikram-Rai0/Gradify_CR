import crypto from "crypto";
import db from "../../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ALLOWED_SIGNUP_ROLES, normalizeRole } from "../../utils/roles.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  return jwt.sign(
    { id: user.user_id || user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function publicUser(user) {
  return {
    id: user.user_id,
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status || "active",
  };
}

export const userSignup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  const normalizedRole = normalizeRole(role);
  if (!ALLOWED_SIGNUP_ROLES.includes(normalizedRole)) {
    return res.status(400).json({ error: "Invalid role. Admin accounts cannot be self-registered." });
  }

  try {
    const [existingUser] = await db.query("SELECT user_id FROM user WHERE email = ?", [
      email.trim().toLowerCase(),
    ]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      "INSERT INTO user (name, email, role, password_hash, verified, status) VALUES (?, ?, ?, ?, ?, ?)",
      [name.trim(), email.trim().toLowerCase(), normalizedRole, password_hash, 1, "active"]
    );

    const user = {
      user_id: result.insertId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: normalizedRole,
      status: "active",
    };

    const token = signToken(user);
    res.cookie("token", token, cookieOptions());
    res.status(201).json({ message: "User created", user: publicUser(user) });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [result] = await db.query("SELECT * FROM user WHERE email = ?", [
      email.trim().toLowerCase(),
    ]);

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const user = result[0];

    if (user.status === "inactive") {
      return res
        .status(403)
        .json({ message: "Your account is inactive. Please contact admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash || "");
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user);
    res.cookie("token", token, cookieOptions());
    res.status(200).json({
      message: "Login successful",
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const [rows] = await db.query("SELECT user_id FROM user WHERE email = ?", [
      email.trim().toLowerCase(),
    ]);

    const generic = { message: "If that account exists, an OTP was generated." };

    if (!rows.length) {
      return res.status(200).json(generic);
    }

    const otp = String(crypto.randomInt(100000, 1000000));
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await db.query("UPDATE user SET otp = ?, otp_expires = ? WHERE user_id = ?", [
      otp,
      expires,
      rows[0].user_id,
    ]);

    const payload = { ...generic };
    if (process.env.NODE_ENV !== "production") {
      payload.otp = otp;
      payload.hint = "OTP is returned only in development. Check this response or the server log.";
      console.log(`Password reset OTP for ${email}: ${otp}`);
    }
    res.status(200).json(payload);
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Failed to process request" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP, and new password are required" });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  try {
    const [rows] = await db.query(
      "SELECT user_id, otp, otp_expires FROM user WHERE email = ?",
      [email.trim().toLowerCase()]
    );
    if (!rows.length || !rows[0].otp || rows[0].otp !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (!rows[0].otp_expires || new Date(rows[0].otp_expires) < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    const password_hash = await bcrypt.hash(newPassword, 12);
    await db.query(
      "UPDATE user SET password_hash = ?, otp = NULL, otp_expires = NULL WHERE user_id = ?",
      [password_hash, rows[0].user_id]
    );
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current and new passwords are required" });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  try {
    const [rows] = await db.query("SELECT password_hash FROM user WHERE user_id = ?", [
      req.user.id,
    ]);
    if (!rows.length) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!match) return res.status(401).json({ message: "Current password is incorrect" });

    const password_hash = await bcrypt.hash(newPassword, 12);
    await db.query("UPDATE user SET password_hash = ? WHERE user_id = ?", [
      password_hash,
      req.user.id,
    ]);
    res.json({ message: "Password updated" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Failed to update password" });
  }
};
