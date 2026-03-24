import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ApplyJob = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

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
    const data = new FormData();

    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    data.append("job_id", id);

    if (file) {
      data.append("resume", file);
    }

    try {
      await axios.post("http://localhost:5000/api/apply", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Application Submitted");
    } catch (err) {
      console.log(err);
      alert("❌ Failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Apply for Job
        </h2>

        <input name="name" placeholder="Full Name" onChange={handleChange} className="border p-2 w-full mb-3 rounded" />
        <input name="course" placeholder="Course" onChange={handleChange} className="border p-2 w-full mb-3 rounded" />
        <input type="date" name="dob" onChange={handleChange} className="border p-2 w-full mb-3 rounded" />
        <input name="college" placeholder="College" onChange={handleChange} className="border p-2 w-full mb-3 rounded" />
        <input name="phone" placeholder="Phone" onChange={handleChange} className="border p-2 w-full mb-3 rounded" />
        <input name="linkedin" placeholder="LinkedIn" onChange={handleChange} className="border p-2 w-full mb-3 rounded" />
        <input name="github" placeholder="GitHub" onChange={handleChange} className="border p-2 w-full mb-3 rounded" />

        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-3" />

        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white w-full py-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ApplyJob;