import db from "../config/db.js";
export const postAnnouncement = async (req, res) => {
  try {
    const { class_id, posted_by, message } = req.body;
    console.log("Received:", { class_id, posted_by, message });

    // Validate required fields
    if (!class_id || !posted_by || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sql =
      "INSERT INTO announcement (class_id, posted_by, message) VALUES (?, ?, ?)";
    db.query(sql, [class_id, posted_by, message], (err, result) => {
      console.log("Inside query callback");
      if (err) {
        console.error("Database error while inserting announcement:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({
        message: "Announcement posted successfully",
        insertId: result.insertId,
      });
    });
  } catch (error) {
    console.error("Error inserting announcement:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Start server

export const getAnnouncement = async (req, res) => {
  try {

    const { class_id, limit } = req.query;
    if (!class_id || isNaN(class_id)) {
      return res.status(400).json({ message: "Valid Class ID is required" });
    }

    // Handle limit parameter safely
    let maxLimit = 50;
    if (limit) {
      const parsed = parseInt(limit);
      if (!isNaN(parsed) && parsed > 0) {
        maxLimit = Math.min(parsed, 100);
      }
    }

    const sql = `
      SELECT announcement_id, posted_by, created_at, message 
      FROM announcement
      WHERE class_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `;

    db.query(sql, [class_id, maxLimit], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database operation failed" });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deletAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "DELETE FROM announcements WHERE announcement_id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Delete error:", err);
        return res.status(500).json({ message: "Server error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.json({ message: "Deleted successfully" });
    });
  } catch (error) {
    return res.status(400).json({ err: error.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_id, posted_by, message } = req.body;

    // Validate required fields
    if (!class_id || !posted_by || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sql =
      "UPDATE announcements SET class_id = ?, posted_by = ?, message = ? WHERE announcement_id = ?";
    db.query(sql, [class_id, posted_by, message, id], (err, result) => {
      if (err) {
        console.error("Update error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Announcement not found" });
      }

      res.json({ message: "Announcement updated successfully" });
    });
  } catch (error) {
    return res.satus(400).json({ err: error.message });
  }
};
