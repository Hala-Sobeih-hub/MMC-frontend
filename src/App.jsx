// import { useEffect, useState } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage.jsx';


import "./App.css";
import "./components/HeroSection.jsx";
// import HeroSection from "./components/HeroSection.jsx";

function App() {
  return (
    <div data-theme="cupcake">
      {/* <HeroSection /> */}
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* Add other routes here */}
        </Routes>
      </Router>
    </div>
  );

}

export default App;
