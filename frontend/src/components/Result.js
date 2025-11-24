// src/components/Result.js
import React from 'react';

const Result = ({ result }) => {
  return (
    <div className="result-container">
      <h3>Detection Result</h3>
      {result ? (
        <div>
          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <div>
              <p>Fake/Real: {result.isFake ? 'Fake' : 'Real'}</p>
              <p>Confidence: {result.confidence}%</p>
            </div>
          )}
        </div>
      ) : (
        <p>No result to show yet.</p>
      )}
    </div>
  );
};

export default Result;
