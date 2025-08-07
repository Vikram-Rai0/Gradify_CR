import db from "../../config/db.js";

export const postAssignment = async (req, res) => {
  const classId = req.params.class_id;
  const posted_by = req.user?.id;

  // Extract text fields
  const { title, description, due_date, grading_type, allow_late } = req.body;

  // Get uploaded files
  const attachments = req.files?.attachments || [];

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const allowLateValue = allow_late === true || allow_late === "true" ? 1 : 0;

    // Fix: Added missing comma between posted_by and title in columns list
    const [assignmentResult] = await connection.query(
      `INSERT INTO assignment 
      (class_id, posted_by, title, description, due_date, grading_type, allow_late)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        classId,
        posted_by,
        title,
        description,
        due_date,
        grading_type,
        allowLateValue,                                 
      ]                                         
    );              

    const assignmentId = assignmentResult.insertId;

    // Insert attachments (if any)
    for (const file of attachments) {
      await connection.query(
        `INSERT INTO assignment_attachments 
        (assignment_id, filename, filepath, filetype)
        VALUES (?, ?, ?, ?)`,
        [assignmentId, file.originalname, file.path, file.mimetype]
      );
    }

    await connection.commit();
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

// get Assignment
export const getAssignment = async (req, res) => {
  const classID = req.params.class_id; // Make sure param name matches your route (class_id or classID)
  const limit = parseInt(req.query.limit) || 10; // Optional: limit parameter via query string, default 10

  try {
    const [rows] = await db.query(
      `SELECT a.title, a.description, u.name, a.due_date, a.grading_type, a.allow_late, a.created_at
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
