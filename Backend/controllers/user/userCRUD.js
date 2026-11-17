import db from "../../config/db.js";
import bcrypt from "bcrypt";
import { ADMIN, ALLOWED_SIGNUP_ROLES, normalizeRole } from "../../utils/roles.js";

export const getCurrentUser = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Not authenticated" });

  try {
    const [result] = await db.query(
      "SELECT user_id, name, email, role, status, created_at FROM user WHERE user_id = ?",
      [userId]
    );
    if (result.length === 0) return res.status(404).json({ message: "User not found" });
    res.status(200).json(result[0]);
  } catch (err) {
    console.error("User fetch error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const role = req.query.role;
    let sql = "SELECT user_id, name, email, role, status, created_at FROM user";
    const params = [];
    if (role) {
      sql += " WHERE role = ?";
      params.push(normalizeRole(role));
    }
    sql += " ORDER BY created_at DESC";
    const [users] = await db.query(sql, params);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const countUsers = async (req, res) => {
  try {
    const [total_users] = await db.query("SELECT COUNT(*) AS total_users FROM user");
    res.status(200).json(total_users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const totalInstructor = async (req, res) => {
  try {
    const [total_instructor] = await db.query(
      "SELECT COUNT(*) AS total_instructor FROM user WHERE role = 'Instructor'"
    );
    res.status(200).json(total_instructor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const totalStudent = async (req, res) => {
  try {
    const [total_students] = await db.query(
      "SELECT COUNT(*) AS total_students FROM user WHERE role = 'Student'"
    );
    res.status(200).json(total_students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const totalSupervisor = async (req, res) => {
  try {
    const [total_supervisors] = await db.query(
      "SELECT COUNT(*) AS total_supervisors FROM user WHERE role = 'Supervisor'"
    );
    res.status(200).json(total_supervisors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUserByAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }
  const normalizedRole = normalizeRole(role);
  if (![...ALLOWED_SIGNUP_ROLES, ADMIN].includes(normalizedRole)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const [existing] = await db.query("SELECT user_id FROM user WHERE email = ?", [
      email.trim().toLowerCase(),
    ]);
    if (existing.length) return res.status(400).json({ error: "User already exists" });

    const password_hash = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      "INSERT INTO user (name, email, role, password_hash, verified, status) VALUES (?, ?, ?, ?, 1, 'active')",
      [name.trim(), email.trim().toLowerCase(), normalizedRole, password_hash]
    );
    res.status(201).json({
      message: "User created",
      user: {
        user_id: result.insertId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: normalizedRole,
        status: "active",
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  const userId = Number(req.params.user_id);
  const requesterId = req.user.id;
  const requesterRole = req.user.role;

  if (requesterId !== userId && requesterRole !== ADMIN) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const [result] = await db.query(
      "SELECT user_id, name, email, role, status FROM user WHERE user_id = ?",
      [userId]
    );
    if (result.length === 0) return res.status(404).json({ error: "User not found" });
    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  const userId = Number(req.params.user_id);
  const requesterId = req.user.id;
  const requesterRole = req.user.role;

  if (requesterId !== userId && requesterRole !== ADMIN) {
    return res.status(403).json({ error: "Access denied" });
  }

  const { name, role, email } = req.body;
  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const fields = ["name = ?", "email = ?"];
    const params = [name.trim(), email.trim().toLowerCase()];

    if (requesterRole === ADMIN && role) {
      fields.push("role = ?");
      params.push(normalizeRole(role));
    }

    params.push(userId);
    const [result] = await db.query(
      `UPDATE user SET ${fields.join(", ")} WHERE user_id = ?`,
      params
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const userId = Number(req.params.user_id);
  const requesterId = req.user.id;
  const requesterRole = req.user.role;

  if (requesterId !== userId && requesterRole !== ADMIN) {
    return res.status(403).json({ error: "Access denied" });
  }
  if (requesterId === userId && requesterRole === ADMIN) {
    return res.status(400).json({ error: "Admins cannot delete their own account" });
  }

  try {
    const [result] = await db.query("DELETE FROM user WHERE user_id = ?", [userId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  const { user_id } = req.params;
  try {
    const [user] = await db.query("SELECT user_id, status FROM user WHERE user_id = ?", [
      user_id,
    ]);
    if (!user.length) return res.status(404).json({ message: "User not found" });

    const newStatus = user[0].status === "active" ? "inactive" : "active";
    await db.query("UPDATE user SET status = ? WHERE user_id = ?", [newStatus, user_id]);
    res.json({
      message: `User status updated to ${newStatus}`,
      user_id: Number(user_id),
      status: newStatus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [[users]] = await db.query("SELECT COUNT(*) AS total FROM user");
    const [[instructors]] = await db.query(
      "SELECT COUNT(*) AS total FROM user WHERE role = 'Instructor'"
    );
    const [[students]] = await db.query(
      "SELECT COUNT(*) AS total FROM user WHERE role = 'Student'"
    );
    const [[classes]] = await db.query(
      "SELECT COUNT(*) AS total FROM classroom WHERE COALESCE(status, 'active') = 'active'"
    );
    const [[assignments]] = await db.query("SELECT COUNT(*) AS total FROM assignment");
    const [[submissions]] = await db.query(
      "SELECT COUNT(*) AS total FROM assignmentsubmission"
    );
    const [recentUsers] = await db.query(
      "SELECT user_id, name, role, created_at FROM user ORDER BY created_at DESC LIMIT 5"
    );
    const [recentClasses] = await db.query(
      "SELECT class_id, class_name, subject, created_at FROM classroom ORDER BY created_at DESC LIMIT 5"
    );

    res.json({
      totals: {
        users: users.total,
        instructors: instructors.total,
        students: students.total,
        classes: classes.total,
        assignments: assignments.total,
        submissions: submissions.total,
      },
      recentUsers,
      recentClasses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
