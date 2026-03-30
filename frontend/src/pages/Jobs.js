import React, { useEffect, useState } from "react";
import axios from "axios";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = (localStorage.getItem("role") || "").toLowerCase();
  const token = localStorage.getItem("token");

  // 🔥 Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log("ROLE:", role);
        console.log("TOKEN:", token);

        const url =
          role === "employer"
            ? "http://localhost:5000/api/my-jobs"
            : "http://localhost:5000/api/jobs";

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("JOBS DATA:", res.data);

        setJobs(res.data);
      } catch (err) {
        console.log("FETCH ERROR:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchJobs();
    }
  }, [role, token]);

  // 🔥 Delete Job
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Job deleted");

      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data || err.message);
      alert("Delete failed");
    }
  };

  // 🔥 Loading state
  if (loading) {
    return <p className="text-center mt-10">Loading jobs...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Title */}
      <h2 className="text-3xl font-bold mb-4">
        {role === "employer" ? "My Jobs" : "Available Jobs"}
      </h2>

      {/* Employer Post Job Button */}
{role === "employer" && (
  <a href="/post-job">
    <button className="bg-green-600 text-white px-4 py-2 mb-4 rounded">
      + Post Job
    </button>
  </a>
)}

      {/* Candidate Button */}
      {role === "candidate" && (
        <a href="/my-applications">
          <button className="bg-blue-500 text-white px-4 py-2 mb-6 rounded">
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
            <div key={job.id} className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p className="text-gray-600">{job.description}</p>
              <p className="text-sm text-gray-500">{job.location}</p>

              <p className="text-sm text-gray-400">
                Start: {job.start_date ? job.start_date.split("T")[0] : "N/A"} |{" "}
                Deadline: {job.deadline ? job.deadline.split("T")[0] : "N/A"}
              </p>

              {/* Candidate UI */}
              {role === "candidate" && (
                <button
                  className="bg-green-500 text-white px-4 py-2 mt-3 rounded"
                  onClick={() =>
                    (window.location.href = `/apply/${job.id}`)
                  }
                >
                  Apply
                </button>
              )}

              {/* Employer UI */}
              {role === "employer" && (
                <div className="mt-3 flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() =>
                      (window.location.href = `/edit-job/${job.id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete
                  </button>

                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() =>
                      (window.location.href = `/jobs/${job.id}/applicants`)
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