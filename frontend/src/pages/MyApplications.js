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

      {applications.map(app => (
        <div key={app.id} className="bg-white p-4 rounded shadow mb-3">
          <h3 className="font-bold">{app.title}</h3>
          <p>Status: {app.status}</p>
        </div>
      ))}
    </div>
  );
}

export default MyApplications;