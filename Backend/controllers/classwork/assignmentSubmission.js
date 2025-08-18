import db from "../../config/db.js";
// Get single assignment
export const getAssignment = async (req, res) => {
  try {
    const { assignId } = req.params;
    const [rows] = await db.query(
      "SELECT assign_id, class_id, title, description, due_date, points, allow_late, created_at FROM assignment WHERE assign_id = ?",
      [assignId]
    );
    if (!rows.length)
      return res.status(404).json({ message: "Assignment not found" });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// Get student's submission
export const getMySubmission = async (req, res) => {
  try {
    const { assignId } = req.params;
    const studentId = req.user.id;

    const [rows] = await db.query(
      `SELECT submission_id, assign_id, student_id, content, file_url, submitted_at, grade
       FROM assignmentsubmission
       WHERE assign_id = ? AND student_id = ?`,
      [assignId, studentId]
    );

    res.json(rows.length ? rows[0] : null);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit or update assignment
export const submitAssignment = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { classId, assignId } = req.params;

    const studentId = req.user.id;
    const { comment } = req.body;
   const fileUrl = req.files && req.files.length
  ? `/uploads/submissions/${req.files[0].filename}`
  : null;


    // 1) Verify assignment
    const [aRows] = await conn.query(
      "SELECT assign_id, due_date, allow_late FROM assignment WHERE assign_id = ? AND class_id = ?",
      [assignId, classId]
    );
    if (!aRows.length)
      return res.status(404).json({ message: "Assignment not found" });

    const assignment = aRows[0];

    // 2) Late submission check
    const now = new Date();
    const due = assignment.due_date ? new Date(assignment.due_date) : null;
    if (due && now > due && !assignment.allow_late) {
      return res
        .status(400)
        .json({ message: "Late submissions are not allowed" });
    }

    // 3) Upsert submission 
    await conn.beginTransaction();
    const [existing] = await conn.query(
      "SELECT submission_id FROM assignmentsubmission WHERE assign_id = ? AND student_id = ?",
      [assignId, studentId]
    );

    if (existing.length) {
      await conn.query(
        `UPDATE assignmentsubmission
         SET content = ?, file_url = COALESCE(?, file_url), submitted_at = NOW()
         WHERE submission_id = ?`,
        [comment || null, fileUrl, existing[0].submission_id]
      );
    } else {
      await conn.query(
        `INSERT INTO assignmentsubmission (assign_id, student_id, content, file_url, submitted_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [assignId, studentId, comment || null, fileUrl]
      );
    }

    await conn.commit();
    res.json({ message: "Submission saved successfully!" });
  } catch (e) {
    console.error(e);
    try {
      await conn.rollback();
    } catch {}
    res.status(500).json({ message: "Server error" });
  } finally {
    conn.release();
  }
};
