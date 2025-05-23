// import { useEffect, useState } from 'react';
import React, { useEffect, useState } from "react";
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

function App() {

  const [token, setToken] = useState("");

  const updateToken = (passedToken, Auth) => {
    localStorage.setItem("token", passedToken);
    localStorage.setItem("Auth", Auth);
    setToken(passedToken);
  }

  const handleLogout = () => {
    localStorage.removeItem("Auth");
    localStorage.removeItem("token");
    setToken("");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col" data-theme="cupcake">
      <Router>
        <NavBar token={token} handleLogout={handleLogout} />
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage updateToken={updateToken} />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          {/* Protected Routes */}
          <Route path="/invite-admin" element={<AdminInvitation />} />
          <Route path="/admin-management" element={<AdminManagement />} />
          <Route path="/user-account" element={<UserAccount />} />


        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
