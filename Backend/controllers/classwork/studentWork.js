import db from "../../config/db.js";
import { notifyUsers } from "../../utils/notify.js";
import { canManageClass } from "../../utils/roles.js";

export const getAssignUser = async (req, res) => {
  try {
    const { assignId } = req.params;

    const [assignment] = await db.query(
      "SELECT assign_id, class_id FROM assignment WHERE assign_id = ?",
      [assignId]
    );
    if (!assignment.length) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    const classId = assignment[0].class_id;

    const [rows] = await db.query(
      `SELECT
        u.user_id as student_id,
        u.name as student_name,
        u.email as student_email,
        asub.submission_id,
        asub.attempt_no,
        asub.content,
        asub.file_url as submissionFile,
        asub.submitted_at as lastSubmitted,
        asub.status,
        asub.grade as points,
        CASE
          WHEN asub.submission_id IS NULL THEN 'not_submitted'
          ELSE asub.status
        END as submission_status,
        af.feedback as latest_feedback,
        af.created_at as feedback_date
       FROM classroom_members cm
       JOIN user u ON cm.user_id = u.user_id
       JOIN classroom c ON c.class_id = cm.class_id
       LEFT JOIN (
         SELECT * FROM assignmentsubmission asub1
         WHERE asub1.assign_id = ?
         AND asub1.attempt_no = (
           SELECT MAX(attempt_no)
           FROM assignmentsubmission asub2
           WHERE asub2.assign_id = asub1.assign_id
           AND asub2.student_id = asub1.student_id
         )
       ) asub ON u.user_id = asub.student_id
       LEFT JOIN (
         SELECT * FROM assignment_feedback af1
         WHERE af1.assign_id = ?
         AND af1.created_at = (
           SELECT MAX(created_at)
           FROM assignment_feedback af2
           WHERE af2.assign_id = af1.assign_id
           AND af2.student_id = af1.student_id
         )
       ) af ON u.user_id = af.student_id AND asub.submission_id = af.submission_id
       WHERE cm.class_id = ?
         AND u.role = 'Student'
         AND u.user_id != c.instructor_id
       ORDER BY
         CASE asub.status
           WHEN 'pending' THEN 1
           WHEN 'resubmit' THEN 2
           WHEN 'accept' THEN 3
           ELSE 4
         END,
         asub.submitted_at DESC`,
      [assignId, assignId, classId]
    );

    const submissionStats = {
      total: rows.length,
      pending: rows.filter((r) => r.submission_status === "pending").length,
      accepted: rows.filter((r) => r.submission_status === "accept").length,
      resubmit: rows.filter((r) => r.submission_status === "resubmit").length,
      not_submitted: rows.filter((r) => r.submission_status === "not_submitted").length,
    };

    res.json({
      students: rows,
      stats: submissionStats,
    });
  } catch (error) {
    console.error("Error fetching assignment users:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getStudentSubmission = async (req, res) => {
  try {
    const { classId, assignId, studentId } = req.params;

    const [submission] = await db.query(
      `SELECT
        u.user_id AS student_id,
        u.name AS student_name,
        u.email AS student_email,
        asub.submission_id,
        asub.attempt_no,
        asub.content,
        asub.file_url AS submissionFile,
        asub.submitted_at AS lastSubmitted,
        asub.status,
        asub.grade AS points
       FROM user u
       LEFT JOIN assignmentsubmission asub
         ON u.user_id = asub.student_id AND asub.assign_id = ?
       WHERE u.user_id = ?
       ORDER BY asub.attempt_no DESC
       LIMIT 1`,
      [assignId, studentId]
    );

    const [feedbackHistory] = await db.query(
      `SELECT af.feedback, af.status, af.created_at, u.name AS instructor_name
       FROM assignment_feedback af
       JOIN user u ON af.instructor_id = u.user_id
       WHERE af.assign_id = ? AND af.student_id = ?
       ORDER BY af.created_at DESC`,
      [assignId, studentId]
    );

    const [allAttempts] = await db.query(
      `SELECT submission_id, attempt_no, content, file_url, submitted_at, grade, status
       FROM assignmentsubmission
       WHERE assign_id = ? AND student_id = ?
       ORDER BY attempt_no DESC`,
      [assignId, studentId]
    );

    res.json({
      classId,
      submission: submission[0] || null,
      feedbackHistory,
      allAttempts,
    });
  } catch (error) {
    console.error("Error fetching student submission:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleAssignmentAction = async (req, res) => {
  const conn = await db.getConnection();
  try {
    if (!canManageClass(req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { assignId, classId } = req.params;
    const { studentId, action, feedback, grade } = req.body;
    const instructorId = req.user.id;

    if (!["accept", "resubmit"].includes(action)) {
      return res
        .status(400)
        .json({ message: "Invalid action. Must be 'accept' or 'resubmit'" });
    }
    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    await conn.beginTransaction();

    const [latest] = await conn.query(
      `SELECT submission_id, status, attempt_no
       FROM assignmentsubmission
       WHERE assign_id = ? AND student_id = ?
       ORDER BY attempt_no DESC
       LIMIT 1`,
      [assignId, studentId]
    );

    if (!latest.length) {
      await conn.rollback();
      return res.status(404).json({ message: "No submission found" });
    }

    const submission = latest[0];
    if (submission.status !== "pending") {
      await conn.rollback();
      return res.status(400).json({
        message: `Submission already ${submission.status}. Cannot change status.`,
      });
    }

    await conn.query(
      `INSERT INTO assignment_feedback
       (assign_id, student_id, instructor_id, submission_id, feedback, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [assignId, studentId, instructorId, submission.submission_id, feedback || null, action]
    );

    await conn.query(
      `UPDATE assignmentsubmission SET status = ?, grade = ? WHERE submission_id = ?`,
      [action, grade || null, submission.submission_id]
    );

    await conn.commit();

    await notifyUsers(
      [studentId],
      action === "accept" ? "Your assignment was accepted" : "Please resubmit your assignment",
      `/classroom/${classId}/assignment/${assignId}`
    );

    res.json({
      message: `Submission ${action === "accept" ? "accepted" : "marked for resubmission"}`,
      action,
      feedback: feedback || null,
      grade: grade || null,
    });
  } catch (err) {
    console.error("Error handling assignment action:", err);
    try {
      await conn.rollback();
    } catch (rollbackErr) {
      console.error("Rollback failed:", rollbackErr);
    }
    res.status(500).json({ message: "Error reviewing submission" });
  } finally {
    conn.release();
  }
};

export const handleBulkAction = async (req, res) => {
  const conn = await db.getConnection();
  try {
    if (!canManageClass(req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { assignId, classId } = req.params;
    const { studentIds, action, feedback, grade } = req.body;
    const instructorId = req.user.id;

    if (!["accept", "resubmit"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: "Student IDs array is required" });
    }

    await conn.beginTransaction();
    const results = [];

    for (const studentId of studentIds) {
      try {
        const [latest] = await conn.query(
          `SELECT submission_id, status FROM assignmentsubmission
           WHERE assign_id = ? AND student_id = ?
           ORDER BY attempt_no DESC LIMIT 1`,
          [assignId, studentId]
        );

        if (!latest.length || latest[0].status !== "pending") {
          results.push({ studentId, success: false, reason: "No pending submission" });
          continue;
        }

        await conn.query(
          `INSERT INTO assignment_feedback
           (assign_id, student_id, instructor_id, submission_id, feedback, status)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [assignId, studentId, instructorId, latest[0].submission_id, feedback || null, action]
        );

        await conn.query(
          `UPDATE assignmentsubmission SET status = ?, grade = ? WHERE submission_id = ?`,
          [action, grade || null, latest[0].submission_id]
        );

        results.push({ studentId, success: true });
      } catch (error) {
        results.push({ studentId, success: false, reason: error.message });
      }
    }

    await conn.commit();
    const succeeded = results.filter((r) => r.success).map((r) => r.studentId);
    await notifyUsers(
      succeeded,
      action === "accept" ? "Your assignment was accepted" : "Please resubmit your assignment",
      `/classroom/${classId}/assignment/${assignId}`
    );
    res.json({ message: "Bulk action completed", results });
  } catch (err) {
    console.error("Error in bulk action:", err);
    try {
      await conn.rollback();
    } catch (rollbackErr) {
      console.error("Rollback failed:", rollbackErr);
    }
    res.status(500).json({ message: "Error in bulk action" });
  } finally {
    conn.release();
  }
};
