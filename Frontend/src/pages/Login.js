import React, { useState } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:5000";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login",  {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "employer") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/jobs";
      }

    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-400">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white w-full p-2 rounded"
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