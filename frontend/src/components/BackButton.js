import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/') return null;

  return (
    <button className="back-btn" onClick={() => navigate(-1)}>
      ← Back
    </button>
  );
};

export default BackButton;