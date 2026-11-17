import crypto from "crypto";
import db from "../../config/db.js";
import { canManageClass, ADMIN } from "../../utils/roles.js";

function generateInviteCode() {
  return crypto.randomBytes(4).toString("hex");
}

export const createroom = async (req, res) => {
  const { class_name, section, subject, semester, end_date, invite_code } = req.body;

  if (!class_name?.trim() || !subject?.trim()) {
    return res.status(400).json({ error: "Class name and subject are required." });
  }

  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized: User info missing." });
  }

  if (!canManageClass(req.user)) {
    return res.status(403).json({ error: "Only instructors can create classrooms." });
  }

  try {
    const code = (invite_code || generateInviteCode()).trim();
    const start_date = new Date();

    if (end_date && start_date >= new Date(end_date)) {
      return res.status(400).json({ error: "End date must be after today." });
    }

    const [result] = await db.execute(
      `INSERT INTO classroom (class_name, subject, section, instructor_id, invite_code, semester, start_date, end_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        class_name.trim(),
        subject.trim(),
        section || null,
        req.user.id,
        code,
        semester || null,
        start_date,
        end_date || null,
      ]
    );

    const class_id = result.insertId;
    await db.execute(
      `INSERT IGNORE INTO classroom_members (user_id, class_id) VALUES (?, ?)`,
      [req.user.id, class_id]
    );

    res.status(201).json({
      class_id,
      class_name: class_name.trim(),
      subject: subject.trim(),
      section: section || null,
      invite_code: code,
      semester: semester || null,
      start_date,
      end_date: end_date || null,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Invite code must be unique." });
    }
    console.error(err);
    res.status(500).json({ error: "Database error." });
  }
};

export const getClassroom = async (req, res) => {
  const user_id = req.user?.id;
  if (!user_id) return res.status(401).json({ error: "Unauthorized" });

  try {
    if (req.user.role === ADMIN) {
      const [all] = await db.execute(
        `SELECT c.*, u.name AS instructor_name
         FROM classroom c
         LEFT JOIN user u ON c.instructor_id = u.user_id
         ORDER BY c.created_at DESC`
      );
      return res.status(200).json(all);
    }

    const [createdClasses] = await db.execute(
      `SELECT c.*, u.name AS instructor_name
       FROM classroom c
       LEFT JOIN user u ON c.instructor_id = u.user_id
       WHERE c.instructor_id = ?`,
      [user_id]
    );

    const [joinedClasses] = await db.execute(
      `SELECT c.*, u.name AS instructor_name
       FROM classroom c
       JOIN classroom_members cm ON c.class_id = cm.class_id
       LEFT JOIN user u ON c.instructor_id = u.user_id
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

export const getClassroomById = async (req, res) => {
  const { classId } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT c.*, u.name AS instructor_name, u.user_id AS created_by
       FROM classroom c
       LEFT JOIN user u ON c.instructor_id = u.user_id
       WHERE c.class_id = ?`,
      [classId]
    );
    if (!rows.length) return res.status(404).json({ error: "Classroom not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch classroom" });
  }
};

export const fetchClassroomMembers = async (req, res) => {
  try {
    const class_id = req.params.class_id || req.params.classId;
    if (!class_id) return res.status(400).json({ message: "Class ID is required" });

    const [members] = await db.execute(
      `SELECT cm.user_id, u.name, u.email, u.role
       FROM classroom_members cm
       LEFT JOIN user u ON cm.user_id = u.user_id
       WHERE cm.class_id = ? AND (u.role = 'Student' OR u.user_id IS NOT NULL)`,
      [class_id]
    );

    const [creatorResult] = await db.execute(
      `SELECT u.user_id, u.name, u.email, u.role
       FROM classroom c
       LEFT JOIN user u ON c.instructor_id = u.user_id
       WHERE c.class_id = ?`,
      [class_id]
    );

    const creator = creatorResult[0];
    const filteredMembers = members.filter((m) => m.user_id !== creator?.user_id);

    res.status(200).json({ creator, members: filteredMembers });
  } catch (err) {
    console.error("Error fetching classroom members:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateClassroom = async (req, res) => {
  const class_id = req.params.class_id || req.params.classId;
  const { class_name, subject, section, semester, end_date, invite_code, status } =
    req.body;

  try {
    const [existing] = await db.execute(
      `SELECT * FROM classroom WHERE class_id = ?`,
      [class_id]
    );
    if (existing.length === 0) return res.status(404).json({ error: "Classroom not found." });

    const room = existing[0];
    if (req.user.role !== ADMIN && room.instructor_id !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const start_date = room.start_date || room.created_at;
    if (end_date && new Date(start_date) >= new Date(end_date)) {
      return res.status(400).json({ error: "End date must be after start date." });
    }

    await db.execute(
      `UPDATE classroom
       SET class_name = ?, subject = ?, section = ?, semester = ?, end_date = ?, invite_code = ?, status = COALESCE(?, status)
       WHERE class_id = ?`,
      [
        class_name ?? room.class_name,
        subject ?? room.subject,
        section ?? room.section,
        semester ?? room.semester,
        end_date ?? room.end_date,
        invite_code ?? room.invite_code,
        status ?? room.status,
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

export const deleteClassroom = async (req, res) => {
  const class_id = req.params.class_id || req.params.classId;
  try {
    const [existing] = await db.execute(
      `SELECT instructor_id FROM classroom WHERE class_id = ?`,
      [class_id]
    );
    if (!existing.length) return res.status(404).json({ error: "Classroom not found." });
    if (req.user.role !== ADMIN && existing[0].instructor_id !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    await db.execute(`DELETE FROM classroom_members WHERE class_id = ?`, [class_id]);
    await db.execute(`DELETE FROM classroom WHERE class_id = ?`, [class_id]);
    res.json({ message: "Classroom deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete classroom. Remove related work first." });
  }
};

export const countActiveClass = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT COUNT(*) AS active_classes
       FROM classroom
       WHERE COALESCE(status, 'active') = 'active'
         AND (end_date IS NULL OR NOW() <= end_date)`
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("Error counting active classes:", err);
    res.status(500).json({ error: "Database error" });
  }
};

export const removeClassroomMember = async (req, res) => {
  const classId = req.params.classId;
  const userId = Number(req.params.userId);

  try {
    const [room] = await db.execute(
      `SELECT instructor_id FROM classroom WHERE class_id = ?`,
      [classId]
    );
    if (!room.length) return res.status(404).json({ error: "Classroom not found." });
    if (req.user.role !== ADMIN && room[0].instructor_id !== req.user.id) {
      return res.status(403).json({ error: "Only the instructor can remove members." });
    }
    if (room[0].instructor_id === userId) {
      return res.status(400).json({ error: "The class instructor cannot be removed." });
    }

    const [result] = await db.execute(
      `DELETE FROM classroom_members WHERE class_id = ? AND user_id = ?`,
      [classId, userId]
    );
    if (!result.affectedRows) {
      return res.status(404).json({ error: "Member not found in this class." });
    }
    res.json({ message: "Member removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove member" });
  }
};

export const leaveClassroom = async (req, res) => {
  const classId = req.params.classId;
  try {
    const [room] = await db.execute(
      `SELECT instructor_id FROM classroom WHERE class_id = ?`,
      [classId]
    );
    if (!room.length) return res.status(404).json({ error: "Classroom not found." });
    if (room[0].instructor_id === req.user.id) {
      return res.status(400).json({ error: "Instructors cannot leave their own class." });
    }

    const [result] = await db.execute(
      `DELETE FROM classroom_members WHERE class_id = ? AND user_id = ?`,
      [classId, req.user.id]
    );
    if (!result.affectedRows) {
      return res.status(404).json({ error: "You are not a member of this class." });
    }
    res.json({ message: "You left the class" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to leave class" });
  }
};

export const getTeachingClasses = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT c.*,
              (SELECT COUNT(*) FROM classroom_members cm WHERE cm.class_id = c.class_id) AS member_count
       FROM classroom c
       WHERE c.instructor_id = ?
       ORDER BY c.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch teaching classes" });
  }
};
