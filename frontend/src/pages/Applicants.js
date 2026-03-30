import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Applicants() {
  const { id } = useParams();
  const [apps, setApps] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/jobs/${id}/applicants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("APPLICANTS:", res.data);
        setApps(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const updateStatus = async (appId, status) => {
  try {
    await axios.put(
      `http://localhost:5000/api/applications/${appId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Status updated");

    setApps((prev) =>
      prev.map((a) =>
        a.id === appId ? { ...a, status } : a
      )
    );
  } catch (err) {
    console.log("UPDATE ERROR:", err.response?.data || err.message);
    alert("Failed");
  }
};

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Applicants</h2>

      {apps.length === 0 ? (
        <p>No applicants</p>
      ) : (
        apps.map((app) => (
          <div key={app.id} className="border p-4 mb-3">
            <p><b>Name:</b> {app.name}</p>
            <p><b>Email:</b> {app.email}</p>
            <p><b>Status:</b> {app.status}</p>

            <div className="flex gap-2 mt-2">
              <button
                className="bg-green-500 text-white px-3 py-1"
                onClick={() => updateStatus(app.id, "selected")}
              >
                Accept
              </button>

              <button
                className="bg-red-500 text-white px-3 py-1"
                onClick={() => updateStatus(app.id, "rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Applicants;