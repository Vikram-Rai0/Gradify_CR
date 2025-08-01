import db from "../config/db.js";

// ✅ POST: Create new announcement
export const postAnnouncement = async (req, res) => {
  try {
    const { class_id, message } = req.body;
    const posted_by = req.user?.id;

    if (!class_id || !posted_by || !message?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sql = `
      INSERT INTO announcement (class_id, posted_by, message)
      VALUES (?, ?, ?)
    `;
    db.query(sql, [class_id, posted_by, message], (err, result) => {
      if (err) {
        console.error(
          "Database error while inserting announcement:",
          err.sqlMessage || err
        );
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({
        message: "Announcement posted successfully",
        insertId: result.insertId,
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
  
// ✅ GET: Get announcements for a class
// Get announcements
export const getAnnouncement = async (req, res) => {
  try {
    const class_id = req.params.class_id;

    const limit = parseInt(req.query.limit) || 10; // Optional limit from query or default to 10
    if (!class_id) {
      return res.status(400).json({ message: "class_id not found in cookies" });
    }


    const sql = `
      SELECT a.announcement_id, a.posted_by, a.message, a.created_at
      FROM announcement a
      JOIN user u ON a.posted_by = u.user_id
      WHERE a.class_id = ?
      ORDER BY a.created_at DESC
      LIMIT ?
    `;

    db.query(sql, [class_id, limit], (err, results) => {
      if (err) {
        console.error("Database error:", err.sqlMessage || err);
        return res.status(500).json({ message: "Database operation failed" });
      }

      res.status(200).json(results);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Delete announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `DELETE FROM announcement WHERE announcement_id = ?`;

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Delete error:", err.sqlMessage || err);
        return res.status(500).json({ message: "Server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Announcement not found" });
      }

      res.json({ message: "Deleted successfully" });
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ✅ PUT: Update an announcement
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_id, message } = req.body;
    const posted_by = req.user?.user_id;

    if (!class_id || !posted_by || !message?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sql = `
      UPDATE announcement 
      SET class_id = ?, posted_by = ?, message = ? 
      WHERE announcement_id = ?
    `;
    db.query(sql, [class_id, posted_by, message, id], (err, result) => {
      if (err) {
        console.error("Update error:", err.sqlMessage || err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Announcement not found" });
      }

      res.json({ message: "Announcement updated successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(400).json({ message: error.message });
  }
};
