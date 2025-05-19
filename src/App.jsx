// import { useEffect, useState } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import "./App.css";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Public Routes
import Home from "./pages/Home.jsx";
import LoginPage from './pages/Login/LoginPage.jsx';
import ForgotPassword from './pages/Password/ForgotPassword.jsx';
import ResetPassword from './pages/Password/ResetPassword.jsx';
import AdminInvitation from './pages/Admin/AdminInvitation.jsx';

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
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset" element={<ResetPassword />} />
          {/* Protected Routes */}
          <Route path="/invite-admin" element={<AdminInvitation />} />
        </Routes>
        {/* <Footer /> */}
      </Router>
    </div>
  );

}

export default App;
