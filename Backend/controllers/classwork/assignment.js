import db from "../../config/db.js";
import { notifyUsers } from "../../utils/notify.js";
import { ADMIN, canManageClass } from "../../utils/roles.js";

function publicUploadPath(filepath) {
  if (!filepath) return null;
  const normalized = String(filepath).replace(/\\/g, "/");
  const marker = normalized.indexOf("/uploads/");
  if (marker >= 0) return normalized.slice(marker);
  if (normalized.startsWith("uploads/")) return `/${normalized}`;
  return normalized;
}

export const postAssignment = async (req, res) => {
  const classId = req.params.class_id;
  const posted_by = req.user?.id;
  const { title, description, due_date, points, allow_late, work_type, topic } = req.body;
  const attachments = Array.isArray(req.files) ? req.files : [];

  if (!title?.trim() || !due_date) {
    return res.status(400).json({ message: "Title and due date are required" });
  }
  if (!canManageClass(req.user)) {
    return res.status(403).json({ message: "Only instructors can post assignments" });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const allowLateValue = allow_late === true || allow_late === "true" ? 1 : 0;
    const type = ["assignment", "quiz", "question"].includes(work_type)
      ? work_type
      : "assignment";

    const [assignmentResult] = await connection.query(
      `INSERT INTO assignment
      (class_id, posted_by, title, description, due_date, points, allow_late, work_type, topic)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        classId,
        posted_by,
        title.trim(),
        description || "",
        due_date,
        Number(points) || 0,
        allowLateValue,
        type,
        topic || null,
      ]
    );

    const assignmentId = assignmentResult.insertId;

    for (const file of attachments) {
      await connection.query(
        `INSERT INTO assignment_attachments
        (assignment_id, filename, filepath, filetype)
        VALUES (?, ?, ?, ?)`,
        [
          assignmentId,
          file.originalname,
          `/uploads/assignments/${file.filename}`,
          file.mimetype,
        ]
      );
    }

    await connection.query(
      `INSERT INTO calendarevent (title, description, start_time, end_time, type, linked_id, created_by, class_id)
       VALUES (?, ?, ?, ?, 'Assignment', ?, ?, ?)`,
      [title.trim(), description || "", due_date, due_date, assignmentId, posted_by, classId]
    );

    await connection.commit();

    const [members] = await db.query(
      `SELECT user_id FROM classroom_members WHERE class_id = ? AND user_id != ?`,
      [classId, posted_by]
    );
    await notifyUsers(
      members.map((m) => m.user_id),
      `New ${type}: ${title.trim()}`,
      `/classroom/${classId}/assignment/${assignmentId}`
    );

    res.status(201).json({
      message: "Assignment posted successfully",
      assignmentId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("DB Error:", error);
    res.status(500).json({ message: "Failed to post assignment" });
  } finally {
    connection.release();
  }
};

export const getAssignment = async (req, res) => {
  const classID = req.params.class_id;
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);

  try {
    const [rows] = await db.query(
      `SELECT a.assign_id, a.title, a.description, u.name, a.due_date, a.points,
              a.allow_late, a.created_at, a.work_type, a.topic
       FROM assignment a
       JOIN user u ON a.posted_by = u.user_id
       WHERE a.class_id = ?
       ORDER BY a.created_at DESC
       LIMIT ?`,
      [classID, limit]
    );
    res.json(rows);
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
};

export const getSingleAssignment = async (req, res) => {
  const { class_id, assign_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT a.assign_id, a.class_id, a.title, a.description, u.name, a.due_date,
              a.points, a.allow_late, a.created_at, a.work_type, a.topic, a.posted_by
       FROM assignment a
       JOIN user u ON a.posted_by = u.user_id
       WHERE a.class_id = ? AND a.assign_id = ?`,
      [class_id, assign_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const [files] = await db.query(
      `SELECT id, filename, filepath, filetype FROM assignment_attachments WHERE assignment_id = ?`,
      [assign_id]
    );

    const attachments = files.map((file) => ({
      ...file,
      filepath: publicUploadPath(file.filepath),
    }));

    res.json({ ...rows[0], attachments });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ message: "Failed to fetch assignment" });
  }
};

export const reuseAssignment = async (req, res) => {
  const { class_id } = req.params;
  const { source_assign_id } = req.body;
  if (!source_assign_id) {
    return res.status(400).json({ message: "source_assign_id is required" });
  }

  try {
    const [rows] = await db.query(`SELECT * FROM assignment WHERE assign_id = ?`, [
      source_assign_id,
    ]);
    if (!rows.length) return res.status(404).json({ message: "Source assignment not found" });
    const src = rows[0];

    const [result] = await db.query(
      `INSERT INTO assignment (class_id, posted_by, title, description, due_date, points, allow_late, work_type, topic)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        class_id,
        req.user.id,
        src.title,
        src.description,
        src.due_date,
        src.points,
        src.allow_late,
        src.work_type || "assignment",
        src.topic,
      ]
    );
    res.status(201).json({ message: "Post reused", assignmentId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reuse post" });
  }
};

export const deleteAssignment = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { assign_id } = req.params;
    if (!assign_id) {
      return res.status(400).json({ message: "Assignment ID is required" });
    }

    const [rows] = await conn.query(
      "SELECT posted_by, class_id FROM assignment WHERE assign_id = ?",
      [assign_id]
    );
    if (!rows.length) return res.status(404).json({ message: "Assignment not found" });
    if (rows[0].posted_by !== req.user.id && req.user.role !== ADMIN) {
      return res.status(403).json({ message: "Access denied" });
    }

    await conn.beginTransaction();
    await conn.query("DELETE FROM assignment_attachments WHERE assignment_id = ?", [assign_id]);
    await conn.query("DELETE FROM assignment_feedback WHERE assign_id = ?", [assign_id]);
    await conn.query("DELETE FROM assignmentsubmission WHERE assign_id = ?", [assign_id]);
    await conn.query("DELETE FROM assignment WHERE assign_id = ?", [assign_id]);
    await conn.commit();

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    try {
      await conn.rollback();
    } catch {
      /* ignore */
    }
    console.error("Error deleting assignment:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    conn.release();
  }
};
