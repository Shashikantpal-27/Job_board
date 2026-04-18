import React, { useEffect, useState } from "react";
import API from "../api";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = (localStorage.getItem("role") || "").toLowerCase();

  // 🔥 Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const url = role === "employer" ? "/my-jobs" : "/jobs";

        console.log("Fetching from:", url);

        const res = await API.get(url);

        console.log("JOBS:", res.data);

        // ✅ safety check
        if (Array.isArray(res.data)) {
          setJobs(res.data);
        } else {
          setJobs([]);
        }

      } catch (err) {
        console.log("FETCH ERROR:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [role]);

  // 🔥 Delete Job
  const handleDelete = async (id) => {
    try {
      await API.delete(`/jobs/${id}`);

      alert("Job deleted");

      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err.message);
      alert("Delete failed");
    }
  };

  // 🔄 Loading
  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading jobs...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* Title */}
      <h2 className="text-3xl font-bold mb-4">
        {role === "employer" ? "My Jobs" : "Available Jobs"}
      </h2>

      {/* Employer Button */}
      {role === "employer" && (
        <a href="/post-job">
          <button className="bg-green-600 text-white px-4 py-2 mb-4 rounded hover:bg-green-700">
            + Post Job
          </button>
        </a>
      )}

      {/* Candidate Button */}
      {role === "candidate" && (
        <a href="/my-applications">
          <button className="bg-blue-500 text-white px-4 py-2 mb-6 rounded hover:bg-blue-600">
            My Applications
          </button>
        </a>
      )}

      {/* Jobs List */}
      <div className="grid gap-4">
        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs found</p>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="bg-white p-4 rounded shadow">

              {/* Title */}
              <h3 className="text-xl font-bold">{job.title}</h3>

              {/* Company */}
              <p className="text-gray-700 font-medium">
                Company: {job.company || "N/A"}
              </p>

              {/* Description */}
              <p className="text-gray-600">{job.description}</p>

              {/* Location */}
              <p className="text-sm text-gray-500">
                📍 {job.location || "Not specified"}
              </p>

              {/* Salary */}
              <p className="text-sm text-gray-400">
                💰 {job.salary || "Not disclosed"}
              </p>

              {/* Candidate UI */}
              {role === "candidate" && (
                <button
                  className="bg-green-500 text-white px-4 py-2 mt-3 rounded hover:bg-green-600"
                  onClick={() =>
                    (window.location.href = `/apply/${job._id}`)
                  }
                >
                  Apply
                </button>
              )}

              {/* Employer UI */}
              {role === "employer" && (
                <div className="mt-3 flex gap-2">

                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    onClick={() =>
                      (window.location.href = `/edit-job/${job._id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
                  </button>

                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() =>
                      (window.location.href = `/jobs/${job._id}/applicants`)
                    }
                  >
                    Applicants
                  </button>

                </div>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Jobs;