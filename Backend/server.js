require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const protectedRoutes = require("./routes/protectedRoutes");

const app = express();
const authRoutes = require("./routes/authRoutes");


app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
  res.send("Job Board Backend Running");
});
app.use("/api/auth", authRoutes);

app.use("/api", protectedRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
