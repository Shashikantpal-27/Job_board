import axios from "axios";

const API = axios.create({
  baseURL: "https://job-board-1555.onrender.com",
});

// 🔥 ADD THIS (VERY IMPORTANT)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;