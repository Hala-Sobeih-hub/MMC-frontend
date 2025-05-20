// import { useEffect, useState } from 'react';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import Cart from "./components/Cart.jsx";

//Public Routes
import Home from "./pages/Home.jsx";
import LoginPage from "./pages/Login/LoginPage.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col" data-theme="cupcake">
      <Router>
        <NavBar />
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              // <ProtectedRoute>
              <Cart />
              // </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
