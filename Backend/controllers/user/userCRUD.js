import db from "../../config/db.js";
import bcrypt from "bcrypt";

// ======================== Get All Users (admin only) ========================
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT user_id, name, email, role FROM user");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================== Get Single User (self or admin) ========================
export const getUserById = async (req, res) => {
  const userId = Number(req.params.user_id);
  const requesterId = req.user.id;
  const requesterRole = req.user.role;

  if (requesterId !== userId && requesterRole !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const [result] = await db.query(
      "SELECT user_id, name, email, role FROM user WHERE user_id = ?",
      [userId]
    );

    if (result.length === 0) return res.status(404).json({ error: "User not found" });

    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================== Update User (self or admin) ========================
export const updateUser = async (req, res) => {
  const userId = Number(req.params.user_id);
  const requesterId = req.user.id;
  const requesterRole = req.user.role;

  if (requesterId !== userId && requesterRole !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  const { name, role, email, password } = req.body;

  try {
    const password_hash = password ? await bcrypt.hash(password, 10) : undefined;

    // Build update query dynamically to avoid setting password_hash to undefined
    let query = "UPDATE user SET name = ?, role = ?, email = ?";
    const params = [name, role, email];

    if (password_hash) {
      query += ", password_hash = ?";
      params.push(password_hash);
    }
    query += " WHERE user_id = ?";
    params.push(userId);

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================== Delete User (self or admin) ========================
export const deleteUser = async (req, res) => {
  const userId = Number(req.params.user_id);
  const requesterId = req.user.id;
  const requesterRole = req.user.role;

  if (requesterId !== userId && requesterRole !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const [result] = await db.query("DELETE FROM user WHERE user_id = ?", [userId]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
