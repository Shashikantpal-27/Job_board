import React, { useEffect, useState } from "react";
import axios from "axios";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("https://job-board-1555.onrender.com/api/my-applications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => setApplications(res.data))
    .catch(err => console.log(err));
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6">My Applications</h2>

      {applications.map((app) => (
  <div key={app._id} className="bg-white p-4 rounded shadow mb-3">

    <h3 className="font-bold text-lg">
      {app.job_id?.title || "Job Title"}
    </h3>

    <p>
      <b>Company:</b> {app.job_id?.company || "N/A"}
    </p>

    <p>
      <b>Location:</b> {app.job_id?.location || "N/A"}
    </p>

    <p>
      <b>Status:</b> {app.status}
    </p>

  </div>
))}
    </div>
  );
}

export default MyApplications;