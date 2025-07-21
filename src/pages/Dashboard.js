import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  // Load user details from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUserDetails(storedUser);

    // Load history from localStorage
    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
    setHistory(storedHistory);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Bubbles (Add random positioning) */}
      <div className="bubble" style={{ left: '10%' }}></div>
      <div className="bubble" style={{ left: '30%' }}></div>
      <div className="bubble" style={{ left: '50%' }}></div>
      <div className="bubble" style={{ left: '70%' }}></div>
      <div className="bubble" style={{ left: '90%' }}></div>

      <div className="dashboard-card">
        {/* User Details Section */}
        {userDetails && (
          <div className="user-details-section">
            <h2>User Details</h2>
            <div className="user-details">
              <p><strong>Name:</strong> {userDetails.name}</p>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <p><strong>Registration Date:</strong> {userDetails.registrationDate}</p>
            </div>
          </div>
        )}

        {/* History Section */}
        <div className="history-section">
          <h2>History</h2>
          {history.length === 0 ? (
            <p>No activities found.</p>
          ) : (
            <ul>
              {history.map((activity, index) => (
                <li key={index}>
                  <p><strong>{activity.fileName}</strong> - {activity.result}</p>
                  <p><small>{activity.timestamp}</small></p>
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










