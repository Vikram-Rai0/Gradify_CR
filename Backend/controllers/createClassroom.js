import db from "../config/db.js";
import express from "express";

export const createroom = async (req, res) => {
  const { class_name, section, subject, semester, invite_code } = req.body;
  if (!class_name || !section || !subject || !semester || !invite_code) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const instructor_id = 17;
    const [result] = await db.execute(
      `INSERT INTO classroom (class_name, subject ,section, instructor_id, invite_code , semester)VALUES(?,?,?,?,?,?)`,
      [class_name, subject, section, instructor_id, invite_code, semester]
    );
    res.status(201).json({
      id: result.class_id,
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
