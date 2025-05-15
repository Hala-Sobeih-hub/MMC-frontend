// import { useEffect, useState } from 'react';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Public Routes
import Home from "./pages/Home.jsx";
import LoginPage from "./pages/Login/LoginPage.jsx";

function App() {
  return (
    <div data-theme="cupcake">
      {/* <Home /> */}

      <Router>
        {/* <NavBar /> */}
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Protected Routes */}
        </Routes>
        {/* <Footer /> */}
      </Router>
    </div>
  );
}

export default App;
