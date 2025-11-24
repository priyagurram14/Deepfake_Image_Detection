// src/components/FileUpload.js
import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ setResult }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error during detection:', error);
      setResult({ error: 'Error during detection' });
    }

    setLoading(false);
  };

  return (
    <div className="file-upload-container">
      <h2>Upload a Video/Image</h2>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={onFileChange} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Detect'}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
