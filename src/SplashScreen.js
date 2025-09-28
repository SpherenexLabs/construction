import React, { useState, useEffect } from 'react';
import './SlowSplashScreen.css';

const SlowSplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 6000); // Show for 6 seconds total

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="slow-splash-container">
      <div className="slow-splash-content">
        <img 
          src={`${process.env.PUBLIC_URL}/logo.png`} 
          alt="VRM Groups" 
          className="slow-logo"
        />
        <h1 className="slow-title">VRM GROUPS</h1>
        <p className="slow-subtitle">Construction Materials & Quotations</p>
        <div className="slow-loading">
          <div className="slow-dot"></div>
          <div className="slow-dot"></div>
          <div className="slow-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default SlowSplashScreen;
