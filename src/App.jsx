// import { useEffect, useState } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import "./App.css";
 
//Public Routes
import Home from "./pages/Home.jsx";
import LoginPage from './pages/Login/LoginPage.jsx';
import Products from "./pages/products.jsx";
import Testimonials from "./pages/testimonials.jsx";
import ProductDetails from "./pages/productDetails.jsx";

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
          <Route path="/products" element={<Products />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          {/* Protected Routes */}
        </Routes>
        {/* <Footer /> */}
      </Router>
    </div>
  );

}

export default App;
