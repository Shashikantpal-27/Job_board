const db = require("../config/db");
const sendEmail = require("../utils/email");

// ================= CREATE JOB =================
exports.createJob = (req, res) => {
  const { title, description, location, salary, start_date, deadline } = req.body;

  const sql = `
    INSERT INTO jobs (title, description, location, salary, start_date, deadline, employer_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, description, location, salary, start_date, deadline, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ message: "Error creating job" });

      res.json({ message: "Job created successfully" });
    }
  );
};

// ================= GET JOBS =================
exports.getJobs = (req, res) => {
  const sql = "SELECT * FROM jobs ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching jobs" });

    res.json(results);
  });
};

// ================= APPLY JOB =================
exports.applyJob = (req, res) => {
  const {
    job_id,
    name,
    course,
    dob,
    college,
    phone,
    linkedin,
    github
  } = req.body;

  const resume = req.file ? req.file.filename : null;

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
      if (err) return res.status(500).json({ message: "Apply failed" });

      res.json({ message: "Applied successfully" });
    }
  );
};

// ================= GET APPLICANTS =================
exports.getApplicants = (req, res) => {
  const sql = `
    SELECT 
      applications.id,
      applications.job_id,
      applications.status,
      users.name,
      users.email
    FROM applications
    JOIN users ON applications.candidate_id = users.id
    WHERE applications.job_id IN (
      SELECT id FROM jobs WHERE employer_id = ?
    )
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching applicants" });

    res.json(results);
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
      if (err) return res.status(500).json({ message: "Update failed" });

      res.json({ message: "Job updated successfully" });
    }
  );
};

// ================= DELETE JOB =================
exports.deleteJob = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM jobs 
    WHERE id=? AND employer_id=?
  `;

  db.query(sql, [id, req.user.id], (err) => {
    if (err) return res.status(500).json({ message: "Delete failed" });

    res.json({ message: "Job deleted successfully" });
  });
};

// ================= MY APPLICATIONS =================
exports.getMyApplications = (req, res) => {
  const sql = `
    SELECT applications.*, jobs.title 
    FROM applications
    JOIN jobs ON applications.job_id = jobs.id
    WHERE applications.candidate_id = ?
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching applications" });

    res.json(results);
  });
};

// ================= UPDATE APPLICATION STATUS =================
exports.updateApplicationStatus = (req, res) => {
  const { id } = req.params;
  const { status, email } = req.body;

  const sql = "UPDATE applications SET status=? WHERE id=?";

  db.query(sql, [status, id], async (err) => {
    if (err) return res.status(500).json({ message: "Error updating status" });

    // 📧 Send Email
    if (status === "selected") {
      await sendEmail(
        email,
        "Congratulations 🎉",
        "You have been selected for the job!"
      );
    }

    res.json({ message: "Status updated successfully" });
  });
};