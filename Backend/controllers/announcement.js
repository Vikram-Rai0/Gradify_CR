import db from "../config/db.js";
import { notifyUsers } from "../utils/notify.js";
import { ADMIN, canManageClass } from "../utils/roles.js";

export const postAnnouncement = async (req, res) => {
  try {
    const { class_id, message } = req.body;
    const posted_by = req.user?.id;

    if (!class_id || !posted_by || !message?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!canManageClass(req.user)) {
      return res.status(403).json({ message: "Only instructors can post announcements" });
    }

    const [result] = await db.query(
      `INSERT INTO announcement (class_id, posted_by, message) VALUES (?, ?, ?)`,
      [class_id, posted_by, message]
    );

    const [members] = await db.query(
      `SELECT user_id FROM classroom_members WHERE class_id = ? AND user_id != ?`,
      [class_id, posted_by]
    );
    await notifyUsers(
      members.map((m) => m.user_id),
      "New announcement posted in your class",
      `/classroom/${class_id}/stream`
    );

    res.status(201).json({
      message: "Announcement posted successfully",
      insertId: result.insertId,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAnnouncement = async (req, res) => {
  const { classId } = req.params;
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
  try {
    const [result] = await db.query(
      `SELECT
         a.announcement_id,
         a.class_id,
         a.posted_by,
         a.message,
         a.created_at,
         u.name
       FROM announcement a
       JOIN user u ON a.posted_by = u.user_id
       WHERE a.class_id = ?
       ORDER BY a.created_at DESC
       LIMIT ?`,
      [classId, limit]
    );
    return res.json(result);
  } catch (error) {
    console.error("DB error : ", error);
    res.status(500).json({ message: "Failed to fetch announcement" });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      "SELECT posted_by FROM announcement WHERE announcement_id = ?",
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: "Announcement not found" });
    if (rows[0].posted_by !== req.user.id && req.user.role !== ADMIN) {
      return res.status(403).json({ message: "Access denied" });
    }

    await db.query(`DELETE FROM announcement WHERE announcement_id = ?`, [id]);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const [rows] = await db.query(
      "SELECT posted_by FROM announcement WHERE announcement_id = ?",
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: "Announcement not found" });
    if (rows[0].posted_by !== req.user.id && req.user.role !== ADMIN) {
      return res.status(403).json({ message: "Access denied" });
    }

    await db.query(`UPDATE announcement SET message = ? WHERE announcement_id = ?`, [
      message,
      id,
    ]);
    res.json({ message: "Announcement updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
