const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// Register user
router.post("/register", register);
router.post("/login", login);
// Test route (debug ke liye)
router.get("/test", (req, res) => {
  res.send("Auth route working");
});

module.exports = router;
