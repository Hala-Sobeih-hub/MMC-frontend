import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Icon } from "@iconify/react";
import Logo from "../assets/images/mmc-inflatable-logo.png";

export default function NavBar() {
  // Add state for mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  // const [userInfo, setUserInfo] = useState({});

  const API = `http://localhost:8080/api/cart`;
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  //Get User Info and Number of items in cart
  useEffect(() => {
    const fetchCartInfo = async () => {
      try {
        //if token is not present, set cartItems to 0
        if (!token) {
          setCartItems(0);
          return;
        } else {
          // else if token exists, fetch the cart
          const res = await fetch(`${API}/user/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          //if there is no cart, set cartItems to 0
          if (!res.ok) {
            setCartItems(0);
            return;
          } else {
            //else if there is a cart, get the number of items in the cart
            const data = await res.json();
            console.log("Cart Response:", data.result);
            setCartItems(data.result.itemsList.length);
            //setUserInfo(data.result.userId);
            //console.log("User Info:", data.result.userId);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCartInfo();
  }, []);

  return (
    <div>
      {/* Replace Navbar with standard HTML */}
      <header className="bg-secondary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo section */}
            <div className="flex items-center">
              <img
                src={Logo}
                alt="Company Logo"
                className="h-18 w-18 object-contain
                max-w-[20em] rounded-full
                "
              />
              <span className="ml-2 font-semibold text-neutral hidden text-xl sm:block">
                MMC Inflatables
              </span>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-8">
              <a
                href="/"
                className="text-primary text-lg border-b-2 border-primary-500 px-1 py-2"
              >
                Home
              </a>
              <a
                href="/products"
                className="text-primary hover:text-secondary text-lg px-1 py-2"
              >
                Products
              </a>
              <a
                href="/about"
                className="text-gray-600 hover:text-gray-900 text-lg px-1 py-2"
              >
                About Us
              </a>
              <a
                href="/my-account"
                className="text-gray-600 hover:text-gray-900 text-lg px-1 py-2"
              >
                My Account
                {/* , {userInfo.firstName} {userInfo.lastName} */}
              </a>
            </nav>

            {/* Right side items */}
            <div className="flex items-center">
              {/* Cart button */}
              <div className="relative">
                <button
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                  aria-label="Cart"
                  onClick={() => navigate("/cart")}
                >
                  <Icon icon="lucide:shopping-cart" width={20} height={20} />
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems}
                  </span>
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                className="ml-4 md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Icon icon="lucide:menu" width={24} height={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-secondary border-t">
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-900 bg-gray-50 rounded-md"
              >
                Home
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              >
                Products
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              >
                About Us
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              >
                My Account
              </a>
            </div>
          </div>
        )}
      </header>

      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to ACME</h1>
        <p className="mt-4 text-gray-600">
          Your trusted partner for amazing products.
        </p>
      </div> */}
    </div>
  );
}
