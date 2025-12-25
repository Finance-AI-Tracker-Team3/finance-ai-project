import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

import bgIllustration from "../assets/bg-illustration.png";
import securityImg from "../assets/security-icon.png";

import { loginUser } from "../services/apiService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await loginUser({
      email,
      password,
    });

    // 🔥 IMPORTANT CHECK
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);

      // (Optional) store user info
      localStorage.setItem("user", JSON.stringify(res.data.permissions));

      navigate("/dashboard");
    } else {
      setError("Login failed. Token not received.");
    }
  } catch (err) {
    console.error("Login error:", err);

    // Better error handling
    if (err.response?.status === 401) {
      setError("Invalid email or password");
    } else {
      setError("Server error. Please try again.");
    }
  } finally {
    setLoading(false);
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
              <span className="input-icon">📧</span>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="secondary-links">
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
