import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Logo from "../assets/images/mmc-inflatable-logo.png";
import profilePlaceholder from "../assets/images/empty-profile-pic.jpg";

export default function NavBar({ token, handleLogout, updateCart, isAdmin, profilePic }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [cartItems, setCartItems] = useState(0);

  const API = `http://localhost:8080/api/cart`;

  //Get User Info and Number of items in cart
  useEffect(() => {
    const storedCount = parseInt(localStorage.getItem("cartItemCount")) || 0;
    setCartItems(storedCount); // quick load

    const fetchCartInfo = async () => {
      try {
        if (!token) {
          setCartItems(0);
          return;
        } else {
          const res = await fetch(`${API}/user/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) {
            setCartItems(0);
            return;
          } else {
            const data = await res.json();
            const itemCount = data.result.itemsList.reduce(
              (sum, item) => sum + item.quantity,
              0
            );
            setCartItems(itemCount);
            localStorage.setItem("cartItemCount", itemCount); // keep in sync
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCartInfo();
  }, [updateCart, token]);

  // Hide Logout on these pages
  const hideAuthNav =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/password/forgot" ||
    location.pathname.startsWith("/password/reset");

  useEffect(() => {
    // For debugging/admin role
  }, [token]);

  return (
    <header className="bg-secondary shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <img
              src={Logo}
              alt="Company Logo"
              className="h-18 w-18 object-contain max-w-[20em] rounded-full"
            />
            <span className="ml-2 font-semibold text-neutral hidden text-xl sm:block">
              MMC Inflatables
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-primary text-lg border-b-2 border-primary-500 px-1 py-2"
                  : "text-primary hover:text-secondary text-lg px-1 py-2"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive
                  ? "text-primary text-lg border-b-2 border-primary-500 px-1 py-2"
                  : "text-primary hover:text-secondary text-lg px-1 py-2"
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-gray-600 text-lg border-b-2 border-primary-500 px-1 py-2"
                  : "text-gray-600 hover:text-gray-900 text-lg px-1 py-2"
              }
            >
              About Us
            </NavLink>
            <NavLink
              to={
                isAdmin ? "/admin-management" : token ? "/my-account" : "/login"
              }
              className={({ isActive }) =>
                isActive
                  ? "block px-3 py-2 text-base font-medium text-gray-600 bg-gray-50 rounded-md"
                  : "block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              }
            >
              Account
            </NavLink>
            {/* Only show Logout when signed in and not on auth pages */}
            {token && !hideAuthNav && (
              <NavLink
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                  navigate("/");
                }}
                className="block px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50 hover:text-red-800 rounded-md"
              >
                Logout
              </NavLink>
            )}
          </nav>

          {/* Right side items */}
          <div className="flex items-center">
            {/* Cart button */}
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                aria-label="Cart"
                onClick={() => {
                  navigate("/cart");
                }}
              >
                <Icon icon="lucide:shopping-cart" width={20} height={20} />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems}
                </span>
              </button>
            </div>

            {/* Profile image (only show if logged in and NOT on /my-account) */}
            {token && location.pathname !== "/my-account" && (
              <img
                src={
                  profilePic
                    ? profilePic.startsWith("/uploads")
                      ? `http://localhost:8080${profilePic}`
                      : profilePic
                    : profilePlaceholder
                }
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover ml-4 border-2 border-primary"
              />
            )}

            {/* Mobile Menu Button */}
            <button
              className="ml-4 md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Icon icon="lucide:menu" width={24} height={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-secondary border-t">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "block px-3 py-2 text-base font-medium text-gray-900 bg-gray-50 rounded-md"
                  : "block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive
                  ? "block px-3 py-2 text-base font-medium text-gray-900 bg-gray-50 rounded-md"
                  : "block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "block px-3 py-2 text-base font-medium text-gray-900 bg-gray-50 rounded-md"
                  : "block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              }
            >
              About Us
            </NavLink>
            <NavLink
              to={
                isAdmin ? "/admin-management" : token ? "/my-account" : "/login"
              }
              className={({ isActive }) =>
                isActive
                  ? "block px-3 py-2 text-base font-medium text-gray-600 bg-gray-50 rounded-md"
                  : "block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              }
            >
              Account
            </NavLink>
            {/* Only show Logout when signed in and not on auth pages */}
            {token && !hideAuthNav && (
              <NavLink
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                  setIsMenuOpen(false);
                  navigate("/");
                }}
                className="block px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50 hover:text-red-800 rounded-md"
              >
                Logout
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}