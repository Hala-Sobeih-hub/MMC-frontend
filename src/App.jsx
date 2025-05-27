// import { useEffect, useState } from 'react';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";

//Public Routes
import Home from "./pages/Home.jsx";
import LoginPage from "./pages/Login/LoginPage.jsx";
import ForgotPassword from "./pages/Password/ForgotPassword.jsx";
import ResetPassword from "./pages/Password/ResetPassword.jsx";
import AdminInvitation from "./pages/Admin/AdminInvitation.jsx";
import Cart from "./pages/Cart.jsx";
import Booking from "./pages/Booking.jsx";
import Products from "./pages/products.jsx";
import Testimonials from "./components/testimonialCarousel.jsx";
import ProductDetails from "./pages/productDetails.jsx";
import MyPreviousBookings from "./pages/MyPreviousBookings.jsx";
import AdminManagement from "./pages/Admin/AdminManagement.jsx";
import AdminProducts from "./pages/Admin/AdminProducts.jsx";
import AdminBookings from "./pages/Admin/AdminBookings.jsx";
import AdminUsers from "./pages/Admin/AdminUsers.jsx";
import About from "./pages/About.jsx";
import UserAccount from "./pages/UserAccount.jsx";

function App() {
  const [updateCart, setUpdateCart] = useState(false);

  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [user, setUser] = useState(null);


  const updateToken = (passedToken, Auth) => {
    localStorage.setItem("token", passedToken);
    localStorage.setItem("Auth", Auth);
    setIsAdmin(Auth);
    setToken(passedToken);
  };

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

  useEffect(() => {
    // Fetch user profile on mount if token exists
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:8080/api/users/my-profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data.result));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col" data-theme="cupcake">
      <Router>
        <NavBar
          token={token}
          handleLogout={handleLogout}
          updateCart={updateCart}
          isAdmin={isAdmin}
          profilePic={user?.profilePic}
        />
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<LoginPage updateToken={updateToken} />}
          />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset" element={<ResetPassword />} />
          <Route path="/products" element={<Products />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<ResetPassword />} />
          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              // <ProtectedRoute>
              <Cart setUpdateCart={setUpdateCart} />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={<Booking setUpdateCart={setUpdateCart} />}
          />
          <Route
            path="/my-bookings"
            element={<MyPreviousBookings setUpdateCart={setUpdateCart} />}
          />

          <Route path="/invite-admin" element={<AdminInvitation />} />
          <Route path="/admin-management" element={<AdminManagement />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/about" element={<About />}></Route>

          <Route path="/my-account" element={<UserAccount setUser={setUser} user={user} />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
