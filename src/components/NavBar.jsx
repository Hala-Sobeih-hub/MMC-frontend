import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink
import { Icon } from "@iconify/react";
import Logo from "../assets/images/mmc-inflatable-logo.png";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("Auth") === "true";

  const handleLogout = () => {
    localStorage.removeItem("Auth");
    navigate("/login");
  };

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
              to={localStorage.getItem("Auth") === "true" ? "/admin-management" : "/my-account"}
              className={({ isActive }) =>
                isActive
                  ? "block px-3 py-2 text-base font-medium text-gray-600 bg-gray-50 rounded-md"
                  : "block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              }
            >
              Account
            </NavLink>
            {/* Login/Logout NavLink */}
            {isLoggedIn ? (
              <NavLink
                to="#"
                onClick={e => {
                  e.preventDefault();
                  handleLogout();
                }}
                className="block px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50 hover:text-red-800 rounded-md"
              >
                Logout
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className="block px-3 py-2 text-base font-medium text-primary hover:bg-gray-50 hover:text-primary-700 rounded-md"
              >
                Login
              </NavLink>
            )}
          </nav>

          {/* Right Side Items */}
          <div className="flex items-center">
            {/* Cart Button */}
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                aria-label="Cart"
              >
                <Icon icon="lucide:shopping-cart" width={20} height={20} />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  5
                </span>
              </button>
            </div>

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
              to={localStorage.getItem("Auth") === "true" ? "/admin-management" : "/my-account"}
              className={({ isActive }) =>
                isActive
                  ? "block px-3 py-2 text-base font-medium text-gray-600 bg-gray-50 rounded-md"
                  : "block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              }
            >
              Account
            </NavLink>
            {/* Login/Logout NavLink for Mobile */}
            {isLoggedIn ? (
              <NavLink
                to="#"
                onClick={e => {
                  e.preventDefault();
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50 hover:text-red-800 rounded-md"
              >
                Logout
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-primary hover:bg-gray-50 hover:text-primary-700 rounded-md"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}