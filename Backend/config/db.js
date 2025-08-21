import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.getConnection()
  .then(() => {
    console.log("✅ MYSQL connection pool established.");
  })
  .catch((err) => {
    console.error("❌ MYSQL connection failed:", err);
  });

export default db;
