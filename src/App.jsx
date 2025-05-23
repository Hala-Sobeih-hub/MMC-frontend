// import { useEffect, useState } from 'react';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
 

import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";

//Public Routes
import Home from "./pages/Home.jsx";
import LoginPage from './pages/Login/LoginPage.jsx';
import ForgotPassword from './pages/Password/ForgotPassword.jsx';
import ResetPassword from './pages/Password/ResetPassword.jsx';
import AdminInvitation from './pages/Admin/AdminInvitation.jsx';

import AdminManagement from './pages/Admin/AdminManagement.jsx';
import UserAccount from "./pages/UserAccount.jsx";
import Products from "./pages/products.jsx";
import Testimonials from "./components/testimonialCarousel.jsx";
import ProductDetails from "./pages/productDetails.jsx";
import Cart from "./components/Cart.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col" data-theme="cupcake">
      <Router>
        <NavBar />
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset" element={<ResetPassword />} />
          <Route path="/products" element={<Products />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          {/* Protected Routes */}
          <Route path="/invite-admin" element={<AdminInvitation />} />
          <Route path="/admin-management" element={<AdminManagement />} />
          <Route path="/user-account" element={<UserAccount />} />


          <Route path="/cart" element={<Cart />} />
          
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
