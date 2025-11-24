import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [file, setFile] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/bmp'];

    if (!allowedTypes.includes(uploadedFile?.type)) {
      alert("Only PNG, JPG, JPEG, GIF, and BMP files are allowed.");
      e.target.value = '';
      return;
    }

    setFile(uploadedFile);
    setDetectionResult(null);
    setConfidenceScore(null);
  };

  const handleDetect = async () => {
    if (!file) {
      alert('Please upload an image first!');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setDetectionResult(data.prediction);
        setConfidenceScore(data.confidence.toFixed(2));

        const activity = {
          fileName: file.name,
          result: data.prediction,
          confidence: data.confidence.toFixed(2),
          timestamp: new Date().toLocaleString(),
        };
        let history = JSON.parse(localStorage.getItem('history')) || [];
        history.push(activity);
        localStorage.setItem('history', JSON.stringify(history));
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="home-container">
      
      {/* Navbar */}
      <nav className="navbar">
        <h3 className="logo" onClick={() => navigate('/')}>DeepFake Detector</h3>
        <ul className="nav-links">
          <li onClick={() => navigate('/')}>Log out</li>
          {/* Removed About Us from navbar */}
          <li onClick={() => navigate('/dashboard')}>Dashboard</li>
        </ul>
      </nav>

      {/* Floating Dashboard Icon */}
      <div className="dashboard-icon" onClick={() => navigate('/dashboard')}>
        <img src="https://cdn-icons-png.flaticon.com/512/1828/1828765.png" alt="Dashboard" />
      </div>

      {/* External Preview Box */}
      {file && (
        <div className="external-preview-box">
          <h3 style={{ color: '#111', marginBottom: '10px' }}>Preview</h3>
          <img src={URL.createObjectURL(file)} alt="Preview" className="preview-media" />
        </div>
      )}

      {/* Main Glassmorphism Card */}
      <div className="home-card">
        <h2 style={{ color: '#fff' }}>Deepfake Detection</h2>

        <div className="upload-container">
          <label htmlFor="upload" className="upload-label">
            {file ? file.name : "Upload Image"}
          </label>
          <input id="upload" type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <button className="detect-btn" onClick={handleDetect} disabled={loading}>
          {loading ? <span className="spinner"></span> : 'Detect Deepfake'}
        </button>

        {detectionResult && (
          <div className={`result ${detectionResult === 'Fake' ? 'result-yes' : 'result-no'}`}>
            {detectionResult === 'Fake' ? 'Deepfake Image Detected' : 'Real Image Detected'}<br />
            Confidence: {confidenceScore}
          </div>
        )}
      </div>
       <div>

       </div>
      {/* About Us Section */}
      <div className="about-us-section">
        <h2>About Us</h2>
        <p>
          Welcome to DeepFake Detector, an AI-powered tool designed to help you identify whether an image is real or manipulated using deepfake technology.
          Our goal is to provide users with fast, reliable insights powered by machine learning to promote media authenticity and digital trust.
        </p>
      </div>
      {/* Footer Section */}
<footer className="footer">
  <div className="footer-content">
    <p><strong>Address:</strong> 123 AI Street, Silicon Valley, CA 94043</p>
    <p><strong>Contact:</strong> contact@deepfakedetector.ai | +1 (800) 123-4567</p>
    <p>&copy; {new Date().getFullYear()} DeepFake Detector. All rights reserved.</p>
  </div>
</footer>

    </div>
  );
}

export default Home;

