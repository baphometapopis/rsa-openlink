// src/NotFoundPage.js

import React from 'react';
import './NotFoundPage.css';

export const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">Oops! The page you're looking for doesn't exist.</p>
      <div className="not-found-animation">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
    </div>
  );
};

