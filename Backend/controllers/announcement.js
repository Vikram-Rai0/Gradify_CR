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
    const sql = "SELECT * FROM announcements ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Fetch error:", err);
        return res.status(500).json({ message: "Server error" });
      }
      return res.json(results);
    });
  } catch (error) {
    return res.status(400).json({ err: error.message });
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
