import React from 'react';
import reelLogo from './reelLogo.svg';
import './navBar.css';

function NavBar() {
  return (
    <div className="nav">
      <div className="nav-bar">
        <img src={reelLogo} alt="Reel Logo" />
      </div>
    </div>
  );
}

export default NavBar;
