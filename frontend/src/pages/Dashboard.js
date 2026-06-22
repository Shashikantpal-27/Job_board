import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

function Dashboard() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = (localStorage.getItem("role") || "").toLowerCase();
  const { id } = useParams(); // 🔥 jobId

  // ================= FETCH APPLICANTS =================
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        // 🔥 IMPORTANT: job-specific applicants
        const res = await API.get(`/applicants/${id}`);

        console.log("APPLICANTS:", res.data);
        setApplicants(res.data);
      } catch (err) {
        console.log("ERROR:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (role === "employer" && id) {
      fetchApplicants();
    } else {
      setLoading(false);
    }
  }, [role, id]);

  // ================= ACCESS CONTROL =================
  if (role !== "employer") {
    return (
      <h2 className="text-center mt-10 text-xl text-red-500">
        Access Denied 🚫
      </h2>
    );
  }

  // ================= LOADING =================
  if (loading) {
    return <p className="text-center mt-10">Loading applicants...</p>;
  }

  // ================= UPDATE STATUS =================
  const updateStatus = async (appId, status, email) => {
    try {
      await API.put(`/applications/${appId}`, { status, email });

      alert(`Candidate ${status}`);

      setApplicants((prev) =>
        prev.map((a) =>
          a._id === appId ? { ...a, status } : a
        )
      );
    } catch (err) {
      console.log("STATUS ERROR:", err.response?.data || err.message);
      alert("Failed to update status");
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Applicants</h2>

        <a href="/jobs">
          <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
            ← Back to Jobs
          </button>
        </a>
      </div>

      {/* LIST */}
      {applicants.length === 0 ? (
        <p className="text-gray-500">No applicants found</p>
      ) : (
        applicants.map((a) => (
          <div key={a._id} className="bg-white p-4 rounded shadow mb-3">

            {/* Candidate Info */}
            <h3 className="font-bold text-lg">
              {a.candidate_id?.name || "No Name"}
            </h3>

            <p className="text-gray-600">
              {a.candidate_id?.email || "No Email"}
            </p>

            {/* Job Info */}
            <p className="text-sm mt-1">
              <span className="font-semibold">Job:</span>{" "}
              {a.job_id?.title || "N/A"}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Company:</span>{" "}
              {a.job_id?.company || "N/A"}
            </p>

            {/* Resume */}
            {a.resume && (
              <a
                href={`https://job-board-1555.onrender.com/uploads/${a.resume}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 text-sm block mt-1"
              >
                View Resume
              </a>
            )}

            {/* Status */}
            <p className="mt-2 text-sm">
              Status:{" "}
              <span className="font-semibold">
                {a.status || "Pending"}
              </span>
            </p>

            {/* Buttons */}
            <div className="mt-3 flex gap-2">
              
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={() =>
                  updateStatus(a._id, "selected", a.candidate_id?.email)
                }
              >
                Select
              </button>

              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() =>
                  updateStatus(a._id, "rejected", a.candidate_id?.email)
                }
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

export default Dashboard;