// frontend/src/pages/home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { predictImageFile } from "../api";

function Home() {
  const [file, setFile] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/bmp"];

    if (!uploadedFile) return;
    if (!allowedTypes.includes(uploadedFile.type)) {
      alert("Only PNG, JPG, JPEG, GIF, and BMP files are allowed.");
      e.target.value = "";
      return;
    }

    setFile(uploadedFile);
    setDetectionResult(null);
    setConfidenceScore(null);
  };

  const handleDetect = async () => {
    if (!file) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);
    try {
      // Use api helper (reads env var in production)
      const data = await predictImageFile(file);

      // Normalize; backend returns { prediction, confidence, raw }
      const label = data.prediction ?? data.label ?? "Unknown";
      let conf = data.confidence ?? data.score ?? 0;

      // convert to percent if returned as 0..1
      if (typeof conf === "number" && conf <= 1) {
        conf = (conf * 100).toFixed(2);
      } else if (typeof conf === "number") {
        conf = conf.toFixed(2);
      }

      setDetectionResult(label);
      setConfidenceScore(conf);

      // Save to history in localStorage
      const activity = {
        fileName: file.name,
        result: label,
        confidence: conf,
        confidenceDisplay: typeof conf === "string" ? `${conf}${conf.toString().includes("%") ? "" : "%"}` : `${conf}%`,
        timestamp: new Date().toLocaleString(),
        raw: data.raw ?? data,
      };
      let history = JSON.parse(localStorage.getItem("history")) || [];
      history.push(activity);
      localStorage.setItem("history", JSON.stringify(history));
    } catch (error) {
      console.error("An error occurred:", error);
      alert(`An error occurred: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <h3 className="logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          DeepFake Detector
        </h3>
        <ul className="nav-links">
          <li onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}>
            Log out
          </li>
          <li onClick={() => navigate("/dashboard")}>Dashboard</li>
        </ul>
      </nav>

      {/* Floating Dashboard Icon */}
      <div className="dashboard-icon" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
        <img src="https://cdn-icons-png.flaticon.com/512/1828/1828765.png" alt="Dashboard" width={36} />
      </div>

      {/* Preview box */}
      {file && (
        <div className="external-preview-box">
          <h3 style={{ color: "#111", marginBottom: "10px" }}>Preview</h3>
          <img src={URL.createObjectURL(file)} alt="Preview" className="preview-media" />
        </div>
      )}

      {/* Main Card */}
      <div className="home-card">
        <h2 style={{ color: "#fff" }}>Deepfake Detection</h2>

        <div className="upload-container">
          <label htmlFor="upload" className="upload-label">
            {file ? file.name : "Upload Image"}
          </label>
          <input id="upload" type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <button className="detect-btn" onClick={handleDetect} disabled={loading}>
          {loading ? <span className="spinner" /> : "Detect Deepfake"}
        </button>

        {detectionResult && (
          <div className={`result ${detectionResult === "Fake" ? "result-yes" : "result-no"}`} style={{ marginTop: 12 }}>
            {detectionResult === "Fake" ? "Deepfake Image Detected" : "Real Image Detected"}
            <br />
            Confidence: {confidenceScore}
          </div>
        )}
      </div>

      {/* About & Footer */}
      <div className="about-us-section">
        <h2>About Us</h2>
        <p>
          Welcome to DeepFake Detector — an AI powered tool to identify whether an image is real or manipulated.
          We use an ML model to provide a prediction and a confidence score.
        </p>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p><strong>Address:</strong> 123 AI Street, Silicon Valley, CA 94043</p>
          <p><strong>Contact:</strong> contact@deepfakedetector.ai</p>
          <p>&copy; {new Date().getFullYear()} DeepFake Detector. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
