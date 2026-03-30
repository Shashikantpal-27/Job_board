require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// 🔥 IMPORTS
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");

app.use(cors());
app.use(express.json());

// 🔥 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api", jobRoutes);   // ✅ MUST

// TEST
app.get("/", (req, res) => {
  res.send("Server Running");
});

// START
app.listen(5000, () => {
  console.log("Server running on port 5000");
});