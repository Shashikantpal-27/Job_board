import React, { useEffect, useState } from "react";
import API from "../api";
import { useParams } from "react-router-dom";

function Applicants() {
  const { id } = useParams();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch Applicants
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await API.get(`/jobs/${id}/applicants`);
        console.log("APPLICANTS:", res.data);
        setApps(res.data);
      } catch (err) {
        console.log("FETCH ERROR:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchApplicants();
  }, [id]);

  // 🔥 Update Status
  const updateStatus = async (appId, status) => {
    try {
      await API.put(`/applications/${appId}`, { status });

      alert(`Candidate ${status}`);

      setApps((prev) =>
        prev.map((a) =>
          a._id === appId ? { ...a, status } : a
        )
      );
    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data || err.message);
      alert("Failed");
    }
  };

  // 🔄 Loading
  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading applicants...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Applicants</h2>

      {apps.length === 0 ? (
        <p className="text-gray-500">No applicants</p>
      ) : (
        apps.map((app) => (
          <div key={app._id} className="border p-4 mb-3 rounded shadow bg-white">

            {/* 🔥 JOB INFO */}
            <h3 className="text-lg font-bold">
              {app.jobId?.title || "Job Title"}
            </h3>

            <p className="text-gray-600">
              Company: {app.jobId?.company || "N/A"}
            </p>

            {/* 👤 Candidate Info */}
            <p><b>Name:</b> {app.candidate_id?.name || app.name}</p>
            <p><b>Email:</b> {app.candidate_id?.email || app.email}</p>

            {/* 📌 Status */}
            <p className="mt-2">
              <b>Status:</b>{" "}
              <span className="font-semibold text-blue-600">
                {app.status || "applied"}
              </span>
            </p>

            {/* 📄 Resume */}
            {app.resume && (
              <a
                href={`${process.env.REACT_APP_API_URL || "https://job-board-1555.onrender.com"}/uploads/${app.resume}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 text-sm block mt-2"
              >
                View Resume
              </a>
            )}

            {/* 🔥 Buttons */}
            <div className="flex gap-2 mt-3">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={() => updateStatus(app._id, "selected")}
              >
                Accept
              </button>

              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => updateStatus(app._id, "rejected")}
              >
                Reject
              </button>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default Applicants;