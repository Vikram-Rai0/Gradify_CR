export const postAssignment = async (req, res) => {
  const classId = req.params.class_id;

  // Extract text fields
  const { title, description, due_date, grading_type, allow_late } = req.body;

  // Get uploaded files
  const attachments = req.files?.attachments || [];

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Insert assignment
    const [assignmentResult] = await connection.query(
      `INSERT INTO assignment 
      (class_id,  title, description, due_date, grading_type, allow_late)
      VALUES (?,  ?, ?, ?, ?, ?)`,
      [classId,  title, description, due_date, grading_type, allow_late]
    );

    const assignmentId = assignmentResult.insertId;

    // Insert attachments
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
