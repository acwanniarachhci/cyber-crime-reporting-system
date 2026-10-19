import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">🔒 Scam Report LK</Link>
      <div className="nav-links">
        <Link to="/report">Report a Scam</Link>
        <Link to="/track">Track Case</Link>
        <Link to="/database">Scam Database</Link>
        <Link to="/awareness">Awareness</Link>
        {user && (user.role === 'admin' || user.role === 'investigator') && (
          <>
            <Link to="/admin">Admin Dashboard</Link>
            <Link to="/admin/scam-database">Manage Scam DB</Link>
          </>
        )}
        {user ? (
          <>
            <Link to="/my-reports">My Reports</Link>
            <button className="link-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;