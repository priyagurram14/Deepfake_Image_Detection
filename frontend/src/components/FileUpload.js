// frontend/src/components/FileUpload.js
import React, { useState } from "react";
import { predictImageFile } from "../api";

const FileUpload = ({ setResult }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please choose an image first.");

    setLoading(true);
    try {
      // predictImageFile will send form-data with key "image"
      const data = await predictImageFile(file);
      // backend returns { prediction, confidence, raw }
      setResult(data);
    } catch (err) {
      console.error("Prediction error:", err);
      setResult({ error: err.message || "Prediction failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload an Image</h2>
      <form onSubmit={onSubmit}>
        <input type="file" accept="image/*" onChange={onFileChange} required />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Detect"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
