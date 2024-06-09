import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import DataGather from './dataGather';
import PlayersInOrder from './playersInOrder';
import ListOfMovies from './getListofMovies';
import NavBar from './navBar';
import FooterNavBar from './footer';

import Scoring from './scoring';
import './App.css'; // Import CSS file for global styles
import 'animate.css/animate.min.css'; // Import Animate.css

function App() {
  return (
    <Router>
      <NavBar />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dataGather" element={<DataGather />} />
          <Route path="/playersInOrder" element={<PlayersInOrder />} />
          <Route path="/getListofMovies" element={<ListOfMovies />} />
          <Route path="/scoring" element={<Scoring />} />
        </Routes>
      </div>
      <FooterNavBar />
    </Router>
  );
}

export default App;