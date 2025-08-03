import db from "../../config/db.js";
import express from "express";

export const createroom = async (req, res) => {
  const { class_name, section, subject, semester, invite_code } = req.body;
  if (!class_name || !subject || !semester || !invite_code) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized: User info missing." });
  }
  console.log("req.user:", req.user);
  try {
    const [userRows] = await db.execute(
      "SELECT * FROM user WHERE user_id = ? AND role IN (?, ?, ?)",
      [req.user?.id, "instructor", "teacher", "student"]
    );

    if (userRows.length === 0) {
      return res.status(403).json({ error: "Invalid user or role." });
    }

    const instructor_id = userRows[0].user_id;

    console.log({
      class_name,
      subject,
      section,
      instructor_id,
      invite_code,
      semester,
    });

    const [result] = await db.execute(
      `INSERT INTO classroom (class_name, subject ,section, instructor_id, invite_code , semester)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        class_name,
        subject,
        section ?? null,
        instructor_id,
        invite_code,
        semester,
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
  const role = req.user?.role;

  if (!user_id) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Fetch classrooms created by the user
    const [createdClasses] = await db.execute(
      `SELECT * FROM classroom WHERE instructor_id = ?`,
      [user_id]
    );

    // Fetch classrooms joined by the user
    const [joinedClasses] = await db.execute(
      `SELECT c.* 
       FROM classroom c
       JOIN classroom_members cm ON c.class_id = cm.class_id
       WHERE cm.user_id = ?`,
      [user_id]
    );

    // Merge and remove duplicates using class_id as key
    const mergedClasses = [
      ...createdClasses,
      ...joinedClasses.filter(
        (jc) => !createdClasses.some((cc) => cc.class_id === jc.class_id)
      ),
    ];

    res.status(200).json(mergedClasses);
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    res.status(500).json({ error: "Failed to fetch classrooms" });
  }
};
