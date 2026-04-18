import React, { useState } from "react";
import API from "../api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      // ✅ Validation
      if (!form.name || !form.email || !form.password) {
        return alert("All fields are required");
      }

      if (form.password.length < 6) {
        return alert("Password must be at least 6 characters");
      }

      const res = await API.post("/auth/register", form);

      alert(res.data.message || "Registered successfully 🎉");

      // 🔄 redirect to login
      window.location.href = "/";

    } catch (err) {
      console.log("Register Error:", err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        <input
          className="border p-2 w-full mb-3"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          className="border p-2 w-full mb-3"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <select
          className="border p-2 w-full mb-3"
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="candidate">Candidate</option>
          <option value="employer">Employer</option>
        </select>

        <button
          className="bg-green-500 text-white w-full p-2 rounded hover:bg-green-600"
          onClick={handleRegister}
        >
          Register
        </button>

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <a href="/" className="text-blue-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;