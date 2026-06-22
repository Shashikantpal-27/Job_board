import React, { useState } from "react";
import axios from "axios";

function PostJob() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    start_date: "",
    deadline: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePostJob = async () => {
    try {
      // 🔥 validation
      if (!form.title || !form.description) {
        alert("Title & Description required");
        return;
      }

      console.log("SENDING DATA:", form); // debug

      await axios.post(
        "https://job-board-1555.onrender.com/api/jobs",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Job posted successfully");

      // reset form
      setForm({
        title: "",
        description: "",
        location: "",
        salary: "",
        start_date: "",
        deadline: "",
      });

    } catch (err) {
      console.log("POST ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "❌ Failed to post job");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Post Job</h2>
        <input
  placeholder="Company Name"
  onChange={(e) => setForm({ ...form, company: e.target.value })}
/>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
          placeholder="Job Title"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
          placeholder="Location"
        />

        <input
          name="salary"
          value={form.salary}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
          placeholder="Salary"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
          placeholder="Job Description"
        />

        {/* 🔥 NEW FIELDS */}
        <label className="text-sm">Start Date</label>
        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
        />

        <label className="text-sm">Deadline</label>
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
        />

        <button
          className="bg-green-500 text-white w-full p-2 rounded mt-2"
          onClick={handlePostJob}
        >
          Post Job
        </button>
      </div>
    </div>
  );
}

export default PostJob;