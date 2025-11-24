// frontend/src/pages/dashboard.js
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  // Load user details & history from localStorage
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUserDetails(storedUser);

      const storedHistory = JSON.parse(localStorage.getItem("history")) || [];
      // show most recent first
      setHistory(storedHistory.reverse());
    } catch (err) {
      console.error("Failed to load localStorage data:", err);
    }
  }, []);

  const clearHistory = () => {
    if (!window.confirm("Clear all history?")) return;
    localStorage.removeItem("history");
    setHistory([]);
  };

  return (
    <div className="dashboard-container">
      {/* decorative bubbles */}
      <div className="bubble" style={{ left: "10%" }}></div>
      <div className="bubble" style={{ left: "30%" }}></div>
      <div className="bubble" style={{ left: "50%" }}></div>
      <div className="bubble" style={{ left: "70%" }}></div>
      <div className="bubble" style={{ left: "90%" }}></div>

      <div className="dashboard-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Dashboard</h1>
          <div>
            <button onClick={() => navigate("/home")}>Go to Home</button>
            <button style={{ marginLeft: 8 }} onClick={clearHistory}>
              Clear History
            </button>
          </div>
        </div>

        {/* User Details Section */}
        {userDetails ? (
          <div className="user-details-section">
            <h2>User Details</h2>
            <div className="user-details">
              <p>
                <strong>Name:</strong> {userDetails.name}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p>
                <strong>Registration Date:</strong> {userDetails.registrationDate}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            <p>No user logged in. <button onClick={() => navigate("/login")}>Login</button></p>
          </div>
        )}

        {/* History Section */}
        <div className="history-section" style={{ marginTop: 20 }}>
          <h2>History</h2>
          {history.length === 0 ? (
            <p>No activities found.</p>
          ) : (
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {history.map((activity, index) => (
                <li key={index} style={{ marginBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 8 }}>
                  <p style={{ margin: 0 }}>
                    <strong>{activity.fileName}</strong> — <em>{activity.result}</em>
                    {" "} (<small>{activity.confidenceDisplay ?? activity.confidence}</small>)
                  </p>
                  <p style={{ margin: "4px 0 0 0", color: "#bbb" }}>
                    <small>{activity.timestamp}</small>
                  </p>

                  {/* optional: show raw response */}
                  {activity.raw && (
                    <details style={{ marginTop: 6 }}>
                      <summary style={{ cursor: "pointer" }}>Show raw</summary>
                      <pre style={{ whiteSpace: "pre-wrap", maxHeight: 200, overflow: "auto" }}>{JSON.stringify(activity.raw, null, 2)}</pre>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
