import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // 👈 use SAME CSS styling!

import signupLeftImg from "../assets/signupimage2.png"; // finance big image
import signupIcon from "../assets/signupimage.png"; // form icon (small)

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (!agree) {
      setError("Please agree to Terms & Conditions");
      return;
    }
    alert("Signup Successful!");
    navigate("/login");
  };

  return (
    <div
      className="login-wrapper"
      style={{ backgroundImage: `url(${signupLeftImg})` }}
    >
      {/* LEFT IMAGE PANEL */}
      <div className="illustration-panel">
        <img
          src={signupLeftImg}
          alt="Signup Illustration"
          className="side-illustration"
        />
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="form-panel">
        <div className="blurred-card">
          {/* Center Top Icon */}
          <div className="login-header">
            <img src={signupIcon} alt="Signup Icon" className="login-icon" />
            <h3>Create Account</h3>
          </div>

          <p className="subtitle">Join us & start your journey.</p>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSignup}>
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                type="text"
                placeholder="UserName"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
              <span className="input-icon">🔑</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <label className="secondary-links">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              By signing up, I agree with <Link>Terms & Conditions</Link>
            </label>

            <button className="login-btn">Sign Up</button>

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
