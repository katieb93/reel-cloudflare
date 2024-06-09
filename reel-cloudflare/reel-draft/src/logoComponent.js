// src/components/LogoComponent.js
import React from 'react';
import logo from '../yellowLogo.svg'; // Adjust the path according to your project structure

const LogoComponent = () => {
  return (
    <div>
      <h1>Welcome to My App</h1>
      <img src={logo} alt="Logo" />
    </div>
  );
};

export default LogoComponent;