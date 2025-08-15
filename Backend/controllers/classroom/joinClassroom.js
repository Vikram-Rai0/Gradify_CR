import db from "../../config/db.js";

export const joinClassroom = async (req, res) => {
  const user_id = req.user?.id;
  const { invite_code } = req.body;

  if (!user_id || !invite_code)
    return res.status(400).json({ error: "Missing user or invite code" });

  try {
    // Find classroom by invite code
    const [classes] = await db.execute(
      `SELECT * FROM classroom WHERE invite_code = ?`,
      [invite_code]
    );

    if (classes.length === 0)
      return res.status(404).json({ error: "Invalid invite code" });

    const classData = classes[0];
    const class_id = classes[0].class_id;

    if(classData.instructor_id === user_id){
      return res.status(403).json({error: "You cannot join your own classroom"});
    }
    // Check if classroom_members table exists first
    const [existing] = await db.execute(
      `SELECT * FROM classroom_members WHERE user_id = ? AND class_id = ?`,
      [user_id, class_id]
    );

    if (existing.length > 0)
      return res.status(409).json({ error: "Already joined this class" });

    // Add user to class
    await db.execute(
      `INSERT INTO classroom_members (user_id, class_id) VALUES (?, ?)`,
      [user_id, class_id]
    );

    res.status(200).json({ message: "Successfully joined the class", class_id });
  } catch (err) {
    console.error("Join error:", err);
    res.status(500).json({ error: "Failed to join class" });
  }
};
