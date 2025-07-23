app.post("/api/announcements", (req, res) => {
  const { class_id, posted_by, message } = req.body;

  // Validate required fields
  if (!class_id || !posted_by || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql =
    "INSERT INTO announcements (class_id, posted_by, message) VALUES (?, ?, ?)";
  db.query(sql, [class_id, posted_by, message], (err, result) => {
    if (err) {
      console.error("Error inserting announcement:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(201).json({
      message: "Announcement posted successfully",
      insertId: result.insertId,
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/api/announcements", (req, res) => {
  const sql = "SELECT * FROM announcements ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(results);
  });
});

app.delete("/api/announcements/:id", (req, res) => {
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
});
app.put("/api/announcements/:id", (req, res) => {
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
});
