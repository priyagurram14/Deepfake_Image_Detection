import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirecting
import './Login.css';  // Assuming you have a separate CSS file for styling

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Get stored user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // Check if the entered details match the stored user details
    if (storedUser && storedUser.email === email && storedUser.password === password) {
      // Redirect to home page upon successful login
      navigate('/home');
    } else {
      // If credentials are invalid, show an error message
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>
      {/* Display error message if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      
      {/* Link to Register page */}
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;
