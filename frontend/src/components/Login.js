import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

import bgIllustration from "../assets/bg-illustration.png";
import securityImg from "../assets/security-icon.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (email === "user@growth.com" && password === "password123") {
      alert("Login Successful!");
      navigate("/dashboard");
      setEmail("");
      setPassword("");
    } else {
      setError("Invalid Email or Password.");
    }
  };

  return (
    <div
      className="login-wrapper"
      style={{ backgroundImage: `url(${bgIllustration})` }}
    >
      <div className="illustration-panel">
        <img
          src={bgIllustration}
          alt="illustration"
          className="side-illustration"
        />
        <h2>Your Financial Journey Continues</h2>
        <p>One login away from your financial growth.</p>
      </div>

      <div className="form-panel">
        <div className="login-card blurred-card">
          <div className="login-header">
            <img src={securityImg} alt="secure" className="login-icon" />
            <h3>Welcome Back</h3>
          </div>

          <p className="subtitle">Sign in to continue your journey.</p>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="login-btn">Log In</button>
          </form>

          {/* Links */}
          <div className="secondary-links">
            <Link to="/forgot-password">Forgot Password?</Link>
            <p>
              Don’t have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
