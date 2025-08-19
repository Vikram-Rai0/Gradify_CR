import db from "../../config/db.js";

export const getAssignUser = async (req, res) => {
  try {
    const { classId, assignId } = req.params;
    console.log(req.params);
    const [rows] = await db.query(
      `
      SELECT 
        u.user_id, 
        u.name AS student_name,
        MAX(s.submitted_at) AS lastSubmitted,
        s.grade,
        s.feedback
      FROM assignment a
      JOIN assignmentsubmission s ON a.assign_id = s.assign_id
      JOIN user u ON s.student_id = u.user_id
      WHERE a.class_id = ? AND a.assign_id = ?
      GROUP BY u.user_id, u.name, s.grade, s.feedback
      ORDER BY lastSubmitted DESC;
      `,
      [classId, assignId]
    );
    res.status(200).json(rows);
    console.log(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "serverError" });
  }
};
