// src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import emptyCartAnimation from "../assets/images/empty-cart.json";

//importing Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart({ setUpdateCart }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false); // Prevent re-adding on refresh

  const [userInfo, setUserInfo] = useState({}); // User info from token

  //used to display the success toast
  const [successMessage, setSuccessMessage] = useState(""); // Create the message state variable

  //used to display the warning toast
  const [warningMessage, setWarningMessage] = useState(""); // Create the message state variable

  //used to display the error toast
  const [errorMessage, setErrorMessage] = useState(""); // Create the message state variable

  // Extract query params
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId");
  const quantity = parseInt(queryParams.get("quantity")) || 1;
  const rentalDate = queryParams.get("rentalDate");

  console.log("Product ID:", productId);
  console.log("Quantity:", quantity);
  console.log("Rental Date:", rentalDate);

  const API = `http://localhost:8080/api`;
  const token = localStorage.getItem("token");

  // Used to display the warning Toast
  useEffect(() => {
    if (warningMessage) {
      console.log(`from Inquiry.jsx : ${warningMessage}`);

      toast.warning(warningMessage, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
      });
      // Reset warningMessage after showing the toast
      setWarningMessage("");
    }
  }, [warningMessage]); // Toast only shows when warningMessage changes

  // Fetch user info from server using token
  // This function will be called when the component mounts
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${API}/users/my-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();
        console.log("User Info:", data.result);
        console.log("User ID:", data.result._id);
        setUserInfo(data);
      } catch (err) {
        console.error("User Info Error:", err);
        setError("Failed to load user info.");
      }
    };

    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (
      cart &&
      productId &&
      rentalDate &&
      !addedToCart &&
      !cart.itemsList.some((item) => item.productId._id === productId)
    ) {
      addItemToCart();
    }
  }, [cart, productId, rentalDate, addedToCart]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API}/cart/user/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (!res.ok) throw new Error("Failed to fetch cart");
      if (res.status === 404) {
        console.log("No cart found, creating a new one...");
        // No cart found — create one
        const createRes = await fetch(`${API}/cart/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rentalDate: rentalDate,
          }),
        });

        if (!createRes.ok) throw new Error("Failed to create cart");

        const createdData = await createRes.json();
        setCart(createdData.result);
      } else if (!res.ok) {
        throw new Error("Failed to fetch cart");
      } else {
        const data = await res.json();
        setCart(data.result);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setCartLoading(false);
    }
  };

  const addItemToCart = async () => {
    try {
      const res = await fetch(`${API}/cart/add-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity,
          rentalDate,
        }),
      });

      if (res.status === 409) {
        const data = await res.json();
        console.log("Rental date conflict:", data.message);

        // Show alert once
        //window.alert(data.message);
        setWarningMessage(data.message); // Set warning message to show in toast

        // Redirect back to product page (or any fallback)
        navigate(`/products/${productId}`); // adjust this route to match your actual route

        return; // Prevent further execution
      }

      if (!res.ok) throw new Error("Failed to add item");
      setAddedToCart(true);
      fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const updateQuantity = async (itemId, newQty) => {
    try {
      const res = await fetch(`${API}/cart/update-item`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: itemId, quantity: newQty }),
      });
      if (!res.ok) throw new Error("Failed to update quantity");
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await fetch(`${API}/cart/remove-item`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: itemId }),
      });
      if (!res.ok) throw new Error("Failed to remove item");

      if (res.status === 204) {
        setCart(null); // Clear cart state
        localStorage.setItem("cartItemCount", 0); // Clear cart item count
        // Cart deleted because it became empty
        navigate("/cart");
        return;
      }

      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const getTotalPrice = () => {
    if (!cart || !cart.itemsList) return 0;
    return cart.itemsList.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    navigate(
      "/booking"
      // , {
      //   state: {
      //     cartId: cart._id,
      //     rentalDate: cart.rentalDate,
      //   },
      // }
    );
  };

  // Save cart item count to localStorage whenever cart updates
  useEffect(() => {
    if (cart?.itemsList) {
      const totalItems = cart.itemsList.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      localStorage.setItem("cartItemCount", totalItems.toString());
    }
    //trigger re-render of parent component
    // This is a workaround to force the parent component to re-render
    // when the cart is updated. This is not the best practice, but it works for now.
    setUpdateCart((prev) => !prev);
  }, [cart]);

  if (cartLoading) return <div className="p-4">Loading cart...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* {cart?.itemsList?.length === 0 ? ( */}
      {!cart ||
      !Array.isArray(cart.itemsList) ||
      cart.itemsList.length === 0 ? (
        // <p>Your cart is empty.</p>
        // animation for empty cart

        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mt-4">Your cart is empty.</h2>
          <Lottie animationData={emptyCartAnimation} style={{ height: 250 }} />
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

          <p className="mb-2 text-gray-600">
            Rental Date:{" "}
            <strong>{new Date(cart.rentalDate).toLocaleDateString()}</strong>
          </p>

          <ul className="space-y-4">
            {cart.itemsList.map((item) => {
              {
                console.log(item);
              }
              return (
                <li
                  key={item._id}
                  className="border p-4 rounded shadow-sm flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    {item.productId?.imageUrl && (
                      <img
                        src={item.productId.imageUrl}
                        alt={item.productId.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{item.productId?.name}</p>
                      <p>${item.price} each</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId._id, item.quantity - 1)
                      }
                      className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                    >
                      -
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId._id, item.quantity + 1)
                      }
                      className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.productId._id)}
                      className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 text-right">
            <p className="text-lg font-semibold">Total: ${getTotalPrice()}</p>
            <button
              onClick={handleCheckout}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
