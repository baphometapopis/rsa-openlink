import React from 'react';
import './FullPageLoader.css'; // Make sure to create and import the CSS file

const FullPageLoader = () => {
  return (
    <div className="loader-container">
      <div className="loader-logo">
        <img src="https://www.tvsservice.com/assets/images/tvs.png" alt="Logo" />
      </div>
      <div className="loader"></div>
    </div>
  );
};

export default FullPageLoader;
