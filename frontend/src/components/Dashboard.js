// frontend/src/components/Dashboard.js
import React, { useState } from "react";
import FileUpload from "./FileUpload";
import Result from "./Result";

const Dashboard = () => {
  const [result, setResult] = useState(null);

  return (
    <div className="dashboard-component">
      <h1>Deepfake Detection Dashboard</h1>
      <FileUpload setResult={setResult} />
      <hr />
      <Result result={result} />
    </div>
  );
};

export default Dashboard;
