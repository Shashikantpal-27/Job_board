import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Jobs from "./pages/Jobs";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import PostJob from "./pages/PostJob";
import ApplyJob from "./pages/ApplyJob";
import MyApplications from "./pages/MyApplications";
import Applicants from "./pages/Applicants";
import EditJob from "./pages/EditJob";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/apply/:id" element={<ApplyJob />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/jobs/:id/applicants" element={<Applicants />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/edit-job/:id" element={<EditJob />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;