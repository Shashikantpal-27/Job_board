import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [applicants, setApplicants] = useState([]);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // 🔥 Fetch applicants
  useEffect(() => {
    if (role === "employer") {
      axios.get("http://localhost:5000/api/applicants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => setApplicants(res.data))
      .catch(err => console.log(err));
    }
  }, [token, role]);

  // ❌ Block candidate
  if (role !== "employer") {
    return <h2 className="text-center mt-10 text-xl">Access Denied</h2>;
  }

  // 🔥 DELETE
  const deleteJob = async (jobId) => {
    await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Job deleted");
    window.location.reload();
  };

  // 🔥 UPDATE
  const updateJob = async (jobId) => {
    await axios.put(
      `http://localhost:5000/api/jobs/${jobId}`,
      {
        title: "Updated Title",
        description: "Updated Description",
        location: "Delhi",
        salary: "10 LPA",
        deadline: "2026-04-01",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Job updated");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Applicants</h2>

        <a href="/post-job">
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            + Post Job
          </button>
        </a>
      </div>

      {/* 🔥 APPLICANTS LIST */}
      {applicants.map(a => (
        <div key={a.id} className="bg-white p-4 rounded shadow mb-3">
          <h3 className="font-bold">{a.name}</h3>
          <p>{a.email}</p>

          <button
            className="bg-blue-500 text-white px-3 py-1 mt-2 mr-2 rounded"
            onClick={() => updateJob(a.job_id)}
          >
            Update
          </button>

          <button
            className="bg-red-500 text-white px-3 py-1 mt-2 rounded"
            onClick={() => deleteJob(a.job_id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );

  const updateStatus = async (id, status, email) => {
  const token = localStorage.getItem("token");

  await axios.put(
    `http://localhost:5000/api/applications/${id}`,
    { status, email },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  alert(`Candidate ${status}`);
  window.location.reload();
};
}

export default Dashboard;