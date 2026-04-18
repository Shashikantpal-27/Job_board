import React, { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

const ApplyJob = () => {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    course: "",
    dob: "",
    college: "",
    phone: "",
    linkedin: "",
    github: "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // ✅ Validation
      if (!form.name || !form.phone || !file) {
        return alert("Please fill required fields + upload resume");
      }

      const data = new FormData();

      // append form fields
      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      // append resume
      data.append("resume", file);

      // 🔥 FINAL API CALL (CORRECT)
      await API.post(`/jobs/${id}/apply`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Application Submitted Successfully 🎉");

      // 🔄 Reset form
      setForm({
        name: "",
        course: "",
        dob: "",
        college: "",
        phone: "",
        linkedin: "",
        github: "",
      });
      setFile(null);

    } catch (err) {
      console.log("APPLY ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "❌ Failed to apply");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Apply for Job
        </h2>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          name="course"
          placeholder="Course"
          value={form.course}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />
<label className="text-sm text-gray-600">Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          name="college"
          placeholder="College"
          value={form.college}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          name="linkedin"
          placeholder="LinkedIn URL"
          value={form.linkedin}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          name="github"
          placeholder="GitHub URL"
          value={form.github}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* Resume Upload */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-3"
        />

        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
};

export default ApplyJob;