// frontend/src/components/Result.js
import React from "react";

const Result = ({ result }) => {
  if (!result) return <div className="result-container"><p>No result to show yet.</p></div>;

  // If an error object is returned
  if (result.error) {
    return (
      <div className="result-container">
        <h3>Detection Result</h3>
        <p style={{ color: "red" }}>{result.error}</p>
      </div>
    );
  }

  // Normalized shape from backend: { prediction, confidence, raw }
  const label = result.prediction ?? (result.label || "Unknown");
  // confidence may be a probability (0..1) — convert to percentage if <=1
  let confidence = result.confidence ?? result.score ?? 0;
  if (typeof confidence === "number" && confidence <= 1) {
    confidence = (confidence * 100).toFixed(1) + "%";
  } else {
    confidence = confidence.toString();
  }

  return (
    <div className="result-container">
      <h3>Detection Result</h3>
      <p><strong>Label:</strong> {label}</p>
      <p><strong>Confidence:</strong> {confidence}</p>

      {/* optional: show raw response for debugging */}
      {result.raw && (
        <details>
          <summary>Raw response</summary>
          <pre style={{ maxHeight: 300, overflow: "auto" }}>
            {JSON.stringify(result.raw, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default Result;
