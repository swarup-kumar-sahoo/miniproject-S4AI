import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./signInPage.css";

const SignInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("userId", data.userId);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Error logging in: " + err.message);
    }
  };

  return (
    <div className="signInPage">
      <div className="auth-container">
        <div className="auth-card">
          <div className="logo-container">
            <img src="/logo.png" alt="LAMA AI Logo" className="auth-logo" />
            <h1>LAMA AI</h1>
          </div>
          <h2>Welcome Back!</h2>
          <p className="subtitle">Please sign in to your account</p>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
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
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-button">
              Sign In
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Don't have an account?</p>
            <Link to="/sign-up" className="signup-link">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;