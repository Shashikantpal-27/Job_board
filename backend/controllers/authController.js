const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ================= REGISTER =================
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

    db.query(sql, [name, email, hashedPassword, role], (err, result) => {
      if (err) {
        console.log("Register Error:", err);
        return res.status(500).json({
          message: "User already exists or DB error",
        });
      }

      res.status(201).json({
        message: "User registered successfully",
      });
    });
  } catch (error) {
    console.log("Server Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
exports.login = (req, res) => {
  const { email, password } = req.body;

  // ⚠️ case-insensitive email check
  const sql = "SELECT * FROM users WHERE LOWER(email) = LOWER(?)";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.log("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = results[0];

    try {
      // 🔍 Debug (optional)
      console.log("Entered Password:", password);
      console.log("DB Hash:", user.password);

      const isMatch = await bcrypt.compare(password, user.password);

      console.log("Password Match:", isMatch);

      if (!isMatch) {
        return res.status(401).json({ message: "Wrong password" });
      }

      
      // 🔑 Generate JWT
const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET || "secretkey",
  { expiresIn: "1d" }
);

res.status(200).json({
  message: "Login successful",
  token,
  role: user.role   // ✅ simple & clean
});
    } catch (error) {
      console.log("Login Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
};