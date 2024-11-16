import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./signUpPage.css";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/sign-in");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Error signing up: " + err.message);
    }
  };

  return (
    <div className="signUpPage">
      <div className="auth-container">
        <div className="auth-card">
          <div className="logo-container">
            <img src="/logo.png" alt="LAMA AI Logo" className="auth-logo" />
            <h1>LAMA AI</h1>
          </div>
          <h2>Create an Account</h2>
          <p className="subtitle">Join us and start your AI journey</p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-button">
              Sign Up
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Already have an account?</p>
            <Link to="/sign-in" className="signin-link">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;