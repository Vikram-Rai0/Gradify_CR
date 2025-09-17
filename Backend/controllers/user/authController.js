import db from "../../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// ======================== Signup ========================
export const userSignup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [existingUser] = await db.query(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      "INSERT INTO user (name, email, role, password_hash, verified) VALUES (?, ?, ?, ?, ?)",
      [name, email, role, password_hash, 0]
    );
    console.log(result);

    // Use insertId, not result.user_id
    const insertId = result.insertId;

    const token = jwt.sign(
      { id: insertId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(201).json({ message: "User created", id: insertId });
  } catch (err) {
    console.error("Signup error:", err);
    res
      .status(500)
      .json({ error: "Internal server error", detail: err.message });
  }
};

// ======================== Login ========================
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const [result] = await db.query("SELECT * FROM user WHERE email = ?", [
      email,
    ]);

    if (result.length === 0)
      return res.status(401).json({ message: "Invalid email or password!" });
    const user = result[0];

    if (user.status === "inactive")
      return res
        .status(403)
        .json({ message: "Your account is inactive. Please contact admin." });

    const storedPassword = user.password_hash;

    if (!storedPassword)
      return res.status(500).json({ message: "User password is missing" });

    const isMatch = await bcrypt.compare(password, storedPassword);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1y" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ======================== Logout ========================
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
