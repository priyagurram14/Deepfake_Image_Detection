// frontend/src/api.js

// Detect API URL from environment variables.
// Works for BOTH Create React App (REACT_APP_API_URL)
// and Vite (VITE_API_URL).
require('dotenv').config()
const API =
  process.env.REACT_APP_API_URL ||      // CRA builds
  (typeof import.meta !== "undefined" ? import.meta.env.VITE_API_URL : undefined) || // Vite builds
  "http://localhost:5000";              // default for local dev

console.log("Using API base URL:", API);

/**
 * Send an image file to backend /predict endpoint
 * @param {File} file - image file selected from <input type="file" />
 * @returns {Promise<Object>} response JSON: { prediction, confidence, raw }
 */
export async function predictImageFile(file) {
  const formData = new FormData();
  formData.append("image", file); // backend expects key name "image"

  const response = await fetch(`${API}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Prediction failed (${response.status}): ${text}`);
  }

  return response.json();
}
