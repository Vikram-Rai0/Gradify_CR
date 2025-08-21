// controllers/classwork/assignmentSubmission.js
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

// Get student's submission with feedback history
export const getMySubmission = async (req, res) => {
  try {
    const { assignId } = req.params;
    const studentId = req.user.id;

    // Get latest submission
    const [submissions] = await db.query(
      `SELECT submission_id, assign_id, student_id, attempt_no, content, file_url, 
              submitted_at, grade, status
       FROM assignmentsubmission
       WHERE assign_id = ? AND student_id = ?
       ORDER BY attempt_no DESC
       LIMIT 1`,
      [assignId, studentId]
    );

    if (!submissions.length) {
      return res.json({ submission: null, feedback: [] });
    }

    const submission = submissions[0];

    // Get feedback history for this assignment
    const [feedback] = await db.query(
      `SELECT af.feedback, af.status, af.created_at, u.name as instructor_name
       FROM assignment_feedback af
       JOIN user u ON af.instructor_id = u.user_id
       WHERE af.assign_id = ? AND af.student_id = ?
       ORDER BY af.created_at DESC`,
      [assignId, studentId]
    );

    res.json({ 
      submission, 
      feedback,
      canResubmit: submission.status === 'resubmit'
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit or resubmit assignment
export const submitAssignment = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { classId, assignId } = req.params;
    const studentId = req.user.id;
    const { comment } = req.body;
    const fileUrl =
      req.files && req.files.length
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

    await conn.beginTransaction();

    // 3) Check for existing submissions
    const [existing] = await conn.query(
      "SELECT submission_id, attempt_no, status FROM assignmentsubmission WHERE assign_id = ? AND student_id = ? ORDER BY attempt_no DESC LIMIT 1",
      [assignId, studentId]
    );

    let attemptNo = 1;
    
    if (existing.length) {
      const lastSubmission = existing[0];
      
      // If last submission is accepted, don't allow new submissions
      if (lastSubmission.status === 'accept') {
        await conn.rollback();
        return res.status(400).json({ message: "Assignment already accepted. No further submissions allowed." });
      }
      
      // If resubmit is required, increment attempt number
      if (lastSubmission.status === 'resubmit') {
        attemptNo = lastSubmission.attempt_no + 1;
      } else if (lastSubmission.status === 'pending') {
        // Update existing pending submission
        await conn.query(
          `UPDATE assignmentsubmission
           SET content = ?, file_url = COALESCE(?, file_url), submitted_at = NOW()
           WHERE submission_id = ?`,
          [comment || null, fileUrl, lastSubmission.submission_id]
        );
        await conn.commit();
        return res.json({ message: "Submission updated successfully!" });
      }
    }

    // 4) Create new submission
    await conn.query(
      `INSERT INTO assignmentsubmission (assign_id, student_id, attempt_no, content, file_url, submitted_at, status)
       VALUES (?, ?, ?, ?, ?, NOW(), 'pending')`,
      [assignId, studentId, attemptNo, comment || null, fileUrl]
    );

    await conn.commit();
    return res.json({ message: "Submission saved successfully!" });
  } catch (e) {
    console.error(e);
    try {
      await conn.rollback();
    } catch (rollbackErr) {
      console.error("Rollback failed:", rollbackErr);
    }
    res.status(500).json({ message: "Server error" });
  } finally {
    conn.release();
  }
};

// Unsubmit assignment (only if pending or resubmit)
export const unsubmitAssignment = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { classId, assignId } = req.params;
    const studentId = req.user.id;

    // 1) Verify assignment exists
    const [aRows] = await conn.query(
      "SELECT assign_id, due_date, allow_late FROM assignment WHERE assign_id = ? AND class_id = ?",
      [assignId, classId]
    );

    if (!aRows.length) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const assignment = aRows[0];

    // 2) Check late submission rules
    const now = new Date();
    const due = assignment.due_date ? new Date(assignment.due_date) : null;
    if (due && now > due && !assignment.allow_late) {
      return res.status(400).json({
        message: "Cannot unsubmit after due date (late submissions not allowed)",
      });
    }

    await conn.beginTransaction();

    // 3) Get latest submission
    const [existing] = await conn.query(
      "SELECT submission_id, status FROM assignmentsubmission WHERE assign_id = ? AND student_id = ? ORDER BY attempt_no DESC LIMIT 1",
      [assignId, studentId]
    );

    if (!existing.length) {
      await conn.rollback();
      return res.status(404).json({ message: "No submission found to unsubmit" });
    }

    // 4) Check if submission can be unsubmitted
    if (existing[0].status === 'accept') {
      await conn.rollback();
      return res.status(400).json({ message: "Cannot unsubmit an accepted submission" });
    }

    // 5) Delete latest submission
    await conn.query(
      "DELETE FROM assignmentsubmission WHERE submission_id = ?",
      [existing[0].submission_id]
    );

    await conn.commit();
    return res.json({ message: "Submission removed successfully!" });
  } catch (e) {
    console.error(e);
    try {
      await conn.rollback();
    } catch (rollbackErr) {
      console.error("Rollback failed:", rollbackErr);
    }
    res.status(500).json({ message: "Server error" });
  } finally {
    conn.release();
  }
};