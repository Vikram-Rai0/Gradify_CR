import jwt from "jsonwebtoken";
import { ADMIN } from "../utils/roles.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Token missing." });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "Server authentication is not configured." });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== ADMIN) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};
