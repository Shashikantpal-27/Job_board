require("dotenv").config();
const express = require("express");
const cors = require("cors");

// 🔥 DB CONNECTION
const connectDB = require("./config/db");

const app = express();

// 🔥 CONNECT MONGODB
connectDB();

// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json());

// 🔥 ROUTES
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");

app.use("/api/auth", authRoutes);
app.use("/api", jobRoutes);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

// 🔥 SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});