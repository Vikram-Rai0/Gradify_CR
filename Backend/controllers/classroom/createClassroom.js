import db from "../../config/db.js";

// Create a classroom
export const createroom = async (req, res) => {
  const { class_name, section, subject, semester, end_date, invite_code } =
    req.body;

  if (!class_name || !subject || !semester || !end_date || !invite_code) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized: User info missing." });
  }

  try {
    const [userRows] = await db.execute(
      "SELECT * FROM user WHERE user_id = ? AND role IN (?, ?, ?)",
      [req.user.id, "instructor", "teacher", "student"]
    );

    if (userRows.length === 0) {
      return res.status(403).json({ error: "Invalid user or role." });
    }

    const instructor_id = userRows[0].user_id;

    // Use created_at as start date
    const start_date = new Date(); // current timestamp

    if (start_date >= new Date(end_date)) {
      return res
        .status(400)
        .json({ error: "Start date (creation date) must be before end date." });
    }

    const [result] = await db.execute(
      `INSERT INTO classroom (class_name, subject, section, instructor_id, invite_code, semester, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        class_name,
        subject,
        section ?? null,
        instructor_id,
        invite_code,
        semester,
        start_date,
        end_date,
      ]
    );

    const class_id = result.insertId;

    res.status(201).json({
      class_id,
      class_name,
      subject,
      section,
      invite_code,
      semester,
      start_date,
      end_date,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Invite code must be unique." });
    }
    console.error(err);
    res.status(500).json({ error: "Database error." });
  }
};

// Get classrooms for a user
export const getClassroom = async (req, res) => {
  const user_id = req.user?.id;

  if (!user_id) return res.status(401).json({ error: "Unauthorized" });

  try {
    const [createdClasses] = await db.execute(
      `SELECT * FROM classroom WHERE instructor_id = ?`,
      [user_id]
    );

    const [joinedClasses] = await db.execute(
      `SELECT c.* 
       FROM classroom c
       JOIN classroom_members cm ON c.class_id = cm.class_id
       WHERE cm.user_id = ?`,
      [user_id]
    );

    const mergedClasses = [
      ...createdClasses,
      ...joinedClasses.filter(
        (jc) => !createdClasses.some((cc) => cc.class_id === jc.class_id)
      ),
    ];

    res.status(200).json(mergedClasses);
  } catch (err) {
    console.error("Error fetching classrooms:", err);
    res.status(500).json({ error: "Failed to fetch classrooms" });
  }
};

// Fetch classroom members
export const fetchClassroomMembers = async (req, res) => {
  try {
    const { class_id } = req.params;
    if (!class_id)
      return res.status(400).json({ message: "Class ID is required" });

    const [members] = await db.execute(
      `SELECT cm.user_id, u.name
       FROM classroom_members cm
       LEFT JOIN user u ON cm.user_id = u.user_id
       WHERE cm.class_id = ?`,
      [class_id]
    );

    const [creatorResult] = await db.execute(
      `SELECT u.user_id, u.name
       FROM classroom c
       LEFT JOIN user u ON c.instructor_id = u.user_id
       WHERE c.class_id = ?`,
      [class_id]
    );

    const creator = creatorResult[0];

    res.status(200).json({ creator, members });
  } catch (err) {
    console.error("Error fetching classroom members:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update classroom
export const updateClassroom = async (req, res) => {
  const { class_id } = req.params;
  const {
    class_name,
    subject,
    section,
    semester,
    end_date,
    invite_code,
    status,
    instructor_id,
  } = req.body;

  try {
    // Get the start_date (created_at) from DB for validation
    const [existing] = await db.execute(
      `SELECT start_date FROM classroom WHERE class_id = ?`,
      [class_id]
    );

    if (existing.length === 0)
      return res.status(404).json({ error: "Classroom not found." });

    const start_date = existing[0].start_date;

    if (end_date && new Date(start_date) >= new Date(end_date)) {
      return res
        .status(400)
        .json({ error: "End date must be after start date." });
    }

    const [result] = await db.execute(
      `UPDATE classroom
       SET class_name = ?, subject = ?, section = ?, semester = ?, end_date = ?, invite_code = ?, status = ?, instructor_id = ?
       WHERE class_id = ?`,
      [
        class_name,
        subject,
        section,
        semester,
        end_date,
        invite_code,
        status,
        instructor_id,
        class_id,
      ]
    );

    res.json({ message: "Classroom updated successfully." });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ error: "Invite code must be unique." });
    console.error(err);
    res.status(500).json({ error: "Database error." });
  }
};

/// Count active classes - Alternative version that handles NULL dates
export const countActiveClass = async (req, res) => {
  try {
    console.log("=== DEBUG: countActiveClass called ===");
    
    // Option 1: Only count records with proper start_date and end_date
    const [strictRows] = await db.query(
      `SELECT COUNT(*) AS active_classes
       FROM classroom
       WHERE status = 'active'
         AND start_date IS NOT NULL
         AND end_date IS NOT NULL
         AND NOW() >= start_date
         AND NOW() <= end_date`
    );
    
    // Option 2: Count all active records, treating NULL dates as "always valid"
    const [lenientRows] = await db.query(
      `SELECT COUNT(*) AS active_classes
       FROM classroom
       WHERE status = 'active'
         AND (start_date IS NULL OR NOW() >= start_date)
         AND (end_date IS NULL OR NOW() <= end_date)`
    );
    
    console.log("Strict count (only records with valid dates):", strictRows[0]);
    console.log("Lenient count (includes NULL dates):", lenientRows[0]);
    
    // Choose which approach you want:
    // Use strictRows[0] if you only want properly dated classes
    // Use lenientRows[0] if you want to include classes with NULL dates
    
    res.json(strictRows[0]); // Change this to lenientRows[0] if you prefer
  } catch (err) {
    console.error("Error counting active classes:", err);
    res.status(500).json({ error: "Database error" });
  }
};