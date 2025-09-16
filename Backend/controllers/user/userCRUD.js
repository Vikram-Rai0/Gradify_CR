import db from "../../config/db.js";
import bcrypt from "bcrypt";

// ======================== Get All Users (admin only) ========================
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT user_id, name, email, role ,status FROM user"
    );
    res.status(200).json(users); // Returns all users
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const countUsers = async (req, res) => {
  try {
    const [total_users] = await db.query(
      "SELECT COUNT(*) AS total_users FROM user"
    );
    res.status(200).json(total_users); // { total_users: X }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const totalInstructor = async (req, res) => {
  try {
    const [total_instructor] = await db.query("SELECT COUNT(*) AS total_instructor FROM user WHERE role = 'Instructor'"
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

    // update user Status  

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

//Toggle user status 
export const toggleUserStatus = async (req, res) => {
  const { user_id } = req.params;

  //get current status 
  const [user] = await db.query("SELECT status FROM user WHERE user_id = ?", [user_id]);
  if (!user.length) return res.status(404).json({ message: "User Not found" });

  const currentStatus = user[0].status;
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

  //update Status
  await db.query("UPDATE user SET  status = ? WHERE user_id = ?", [newStatus, user_id])
  res.json({ message: `user Status updated to ${newStatus}` });
}