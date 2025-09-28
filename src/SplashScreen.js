import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Show for 3 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <img 
          src={`${process.env.PUBLIC_URL}/logo.png`} 
          alt="VRM Groups" 
          className="splash-logo"
        />
        <h1 className="splash-title">VRM GROUPS</h1>
        <p className="splash-subtitle">Construction Materials & Quotations</p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
