import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    start_date: "",
    deadline: "",
  });

  // 🔥 Fetch job data
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/jobs")
      .then((res) => {
        const job = res.data.find((j) => j.id == id);

        if (job) {
          setForm({
            title: job.title || "",
            description: job.description || "",
            location: job.location || "",
            salary: job.salary || "",
            start_date: job.start_date
              ? job.start_date.split("T")[0]
              : "",
            deadline: job.deadline
              ? job.deadline.split("T")[0]
              : "",
          });
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  // 🔥 handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 update job
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/jobs/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Job updated ✅");
      navigate("/jobs");
    } catch (err) {
      console.log(err);
      alert("Update failed ❌");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Edit Job</h2>

        <input name="title" value={form.title} onChange={handleChange} className="border p-2 w-full mb-3" placeholder="Title" />
        <input name="location" value={form.location} onChange={handleChange} className="border p-2 w-full mb-3" placeholder="Location" />
        <input name="salary" value={form.salary} onChange={handleChange} className="border p-2 w-full mb-3" placeholder="Salary" />
        
        <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="border p-2 w-full mb-3" />
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="border p-2 w-full mb-3" />

        <textarea name="description" value={form.description} onChange={handleChange} className="border p-2 w-full mb-3" placeholder="Description" />

        <button
          onClick={handleUpdate}
          className="bg-green-500 text-white w-full p-2 rounded"
        >
          Update Job
        </button>
      </div>
    </div>
  );
}

export default EditJob;