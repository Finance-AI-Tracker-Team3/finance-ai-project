import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

import signupLeftImg from "../assets/signupimage2.png";
import signupIcon from "../assets/signupimage.png";

import { signupUser } from "../services/apiService";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ------------------------
  // Password Validator
  // ------------------------
  const validatePassword = (password) => {
    if (password.length < 8)
      return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password))
      return "Password must contain at least one number.";
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
      return "Password must contain at least one special character.";
    return "";
  };

  // ------------------------
  // SIGNUP HANDLER (BACKEND)
  // ------------------------
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (!agree) {
      setError("Please agree to Terms & Conditions.");
      return;
    }

    try {
      setLoading(true);

      await signupUser({
        username,
        email,
        password,
      });

      // Redirect to login after successful signup
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);

      if (err.response?.status === 400) {
        setError(err.response.data?.message || "User already exists.");
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
      style={{ backgroundImage: `url(${signupLeftImg})` }}
    >
      {/* LEFT IMAGE */}
      <div className="illustration-panel">
        <img
          src={signupLeftImg}
          alt="Signup Illustration"
          className="side-illustration"
        />
      </div>

      {/* FORM */}
      <div className="form-panel">
        <div className="blurred-card">
          <div className="login-header">
            <img src={signupIcon} alt="Signup Icon" className="login-icon" />
            <h3>Create Account</h3>
          </div>

          <p className="subtitle">Join us & start your journey.</p>

          {error && <p className="error-message">⚠️ {error}</p>}

          <form onSubmit={handleSignup}>
            {/* USERNAME */}
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <span className="input-icon">📧</span>
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <span className="input-icon">🔑</span>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* TERMS */}
            <label className="secondary-links">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              I agree to the <Link to="/terms">Terms & Conditions</Link>
            </label>

            {/* SUBMIT */}
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <div className="secondary-links">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
