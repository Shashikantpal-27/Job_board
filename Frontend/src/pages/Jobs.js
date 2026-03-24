import React, { useEffect, useState } from "react";
import axios from "axios";

<a href="/my-applications">
  <button className="bg-blue-500 text-white px-4 py-2 mb-4 rounded">
    My Applications
  </button>
</a>
function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/jobs")
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6">Available Jobs</h2>

      <div className="grid gap-4">
        {jobs.map(job => (
          <div key={job.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-bold">{job.title}</h3>
            <p className="text-gray-600">{job.description}</p>

            <button
              className="bg-green-500 text-white px-4 py-2 mt-3 rounded"
              onClick={() => window.location.href = `/apply/${job.id}`}
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;