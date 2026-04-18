import React, { useState } from "react";
import API from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      const token = res.data.token;
      const role = res.data.user?.role;

      if (!token || !role) {
        alert("Login response invalid");
        return;
      }

      // ✅ Save
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // ❌ REMOVE alert (problematic)
      // alert("Login successful 🎉");

      // 🔥 ADD slight delay (safe redirect)
      setTimeout(() => {
        if (role === "employer") {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/jobs";
        }
      }, 500);

    } catch (err) {
      console.log("Login Error:", err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-400">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          className="border p-2 w-full mb-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="mt-3 text-center">
          New user?{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;