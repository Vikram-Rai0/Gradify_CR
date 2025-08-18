import db from "../../config/db.js";

export const getAssignUser = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.name, MAX(s.submitted_at) as lastSubmitted
FROM assignmentSubmission s
JOIN user u ON s.student_id = u.user_id
GROUP BY u.user_id
ORDER BY lastSubmitted DESC;
`
    );
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "serverError" });
  }
};
