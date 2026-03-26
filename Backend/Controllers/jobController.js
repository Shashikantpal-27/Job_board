const db = require("../config/db");
const sendEmail = require("../utils/email");

// ================= CREATE JOB =================
exports.createJob = (req, res) => {
  let {
    title,
    description,
    location,
    salary,
    start_date,
    deadline
  } = req.body;

  console.log("📩 DATA RECEIVED:", req.body);
  console.log("👤 USER:", req.user);

  // 🔥 fix empty values
  location = location || "";
  salary = salary || "";
  start_date = start_date || null;
  deadline = deadline || null;

  const sql = `
    INSERT INTO jobs 
    (title, description, location, salary, start_date, deadline, employer_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, description, location, salary, start_date, deadline, req.user?.id],
    (err) => {
      if (err) {
        console.log("🔥 CREATE JOB ERROR:", err); // 👈 IMPORTANT
        return res.status(500).json({ message: err.message });
      }

      res.json({ message: "Job created successfully" });
    }
  );
};
// ================= GET ALL JOBS =================
exports.getJobs = (req, res) => {
  db.query("SELECT * FROM jobs ORDER BY id DESC", (err, result) => {
    if (err) {
      console.log("GET JOBS ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
};

// ================= GET MY JOBS (EMPLOYER) =================
exports.getMyJobs = (req, res) => {
  const sql = "SELECT * FROM jobs WHERE employer_id = ? ORDER BY id DESC";

  db.query(sql, [req.user.id], (err, result) => {
    if (err) {
      console.log("MY JOBS ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
};

// ================= APPLY JOB =================
exports.applyJob = (req, res) => {
  const job_id = req.params.id;

  const {
    name,
    course,
    dob,
    college,
    phone,
    linkedin,
    github
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Resume required" });
  }

  // 🔥 prevent duplicate apply
  const checkSql = "SELECT * FROM applications WHERE job_id=? AND candidate_id=?";
  db.query(checkSql, [job_id, req.user.id], (err, result) => {
    if (result.length > 0) {
      return res.status(400).json({ message: "Already applied" });
    }

    const resume = req.file.filename;

    const sql = `
      INSERT INTO applications 
      (job_id, candidate_id, name, course, dob, college, phone, linkedin, github, resume)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        job_id,
        req.user.id,
        name,
        course,
        dob,
        college,
        phone,
        linkedin,
        github,
        resume
      ],
      (err) => {
        if (err) {
          console.log("APPLY ERROR:", err);
          return res.status(500).json({ message: err.message });
        }

        res.json({ message: "Applied successfully" });
      }
    );
  });
};

// ================= GET APPLICANTS =================
exports.getApplicants = (req, res) => {
  const job_id = req.params.id;

  const sql = `
    SELECT a.*, u.name, u.email
    FROM applications a
    JOIN users u ON a.candidate_id = u.id
    WHERE a.job_id = ?
  `;

  db.query(sql, [job_id], (err, result) => {
    if (err) {
      console.log("APPLICANTS ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
};

// ================= UPDATE JOB =================
exports.updateJob = (req, res) => {
  const { id } = req.params;
  const { title, description, location, salary, start_date, deadline } = req.body;

  const sql = `
    UPDATE jobs 
    SET title=?, description=?, location=?, salary=?, start_date=?, deadline=?
    WHERE id=? AND employer_id=?
  `;

  db.query(
    sql,
    [title, description, location, salary, start_date, deadline, id, req.user.id],
    (err) => {
      if (err) {
        console.log("UPDATE ERROR:", err);
        return res.status(500).json(err);
      }
      res.json({ message: "Job updated" });
    }
  );
};

// ================= DELETE JOB =================
exports.deleteJob = (req, res) => {
  const { id } = req.params;

  // delete applications first
  db.query("DELETE FROM applications WHERE job_id=?", [id], (err) => {
    if (err) return res.status(500).json(err);

    // then delete job
    db.query(
      "DELETE FROM jobs WHERE id=? AND employer_id=?",
      [id, req.user.id],
      (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Job deleted" });
      }
    );
  });
};

// ================= MY APPLICATIONS =================
exports.getMyApplications = (req, res) => {
  const sql = `
    SELECT a.*, j.title
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.candidate_id = ?
  `;

  db.query(sql, [req.user.id], (err, result) => {
    if (err) {
      console.log("MY APPLICATIONS ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
};

// ================= UPDATE STATUS =================
exports.updateApplicationStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE applications SET status=? WHERE id=?",
    [status, id],
    (err) => {
      if (err) return res.status(500).json(err);

      const sql = `
        SELECT u.email 
        FROM applications a
        JOIN users u ON a.candidate_id = u.id
        WHERE a.id = ?
      `;

      db.query(sql, [id], async (err, result) => {
        if (result.length > 0 && status === "selected") {
         // await sendEmail(
          //  result[0].email,
          //  "Selected 🎉",
          //  "You are selected!"
         // );
        }

        res.json({ message: "Status updated" });
      });
    }
  );
};