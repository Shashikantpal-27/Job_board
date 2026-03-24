import React, { useState } from "react";
import axios from "axios";

function PostJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");

  const token = localStorage.getItem("token");

  const handlePostJob = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/jobs",
        { title, description, location, salary },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Job posted successfully");
    } catch {
      alert("Failed to post job");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Post Job</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Location"
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Salary"
          onChange={(e) => setSalary(e.target.value)}
        />

        <textarea
          className="border p-2 w-full mb-3"
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          className="bg-green-500 text-white w-full p-2 rounded"
          onClick={handlePostJob}
        >
          Post Job
        </button>
      </div>
    </div>
  );
}

export default PostJob;