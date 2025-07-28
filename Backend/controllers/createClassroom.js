import db from "../config/db.js";
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

    res.cookie("class_id", class_id, {
      httpOnly: false,
      path: "/",
      sameSite: "Lax",
    });

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

// Get classrooms (all or filtered by user)
export const getClassroom = async (req, res) => {
  const user_id = req.user?.id;
  const role = req.user?.role;
  const { semester } = req.query;

  try {
    let query = "SELECT * FROM classroom";
    let values = [];

    // Instructor: show only their own classes
    if (["instructor", "teacher"].includes(role)) {
      query += " WHERE instructor_id = ?";
      values.push(user_id);
      if (semester) {
        query += " AND semester = ?";
        values.push(semester);
      }
    } else if (semester) {
      query += " WHERE semester = ?";
      values.push(semester);
    }

    const [rows] = await db.execute(query, values);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    res.status(500).json({ error: "Failed to fetch classrooms" });
  }
};
