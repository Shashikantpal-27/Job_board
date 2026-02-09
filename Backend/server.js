require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();
const authRoutes = require("./routes/authRoutes");


app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
  res.send("Job Board Backend Running");
});
app.use("/api/auth", authRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
