import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="logo">GrowthTrack</h2>
        <span className="nav-link">Dashboard</span>
        <span className="nav-link">Pricing</span>
        <span className="nav-link">Support</span>
      </div>

      <div className="navbar-right">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="nav-btn">
              Login
            </Link>
            <Link to="/signup" className="nav-btn primary-btn">
              Sign Up
            </Link>
          </>
        ) : (
          <div className="profile-menu">
            <div className="avatar">GT</div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
