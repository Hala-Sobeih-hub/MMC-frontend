import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//importing Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Booking = ({ setUpdateCart }) => {
  const [cart, setCart] = useState(null);
  const [userInfo, setUserInfo] = useState({});

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [eventNotes, setEventNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //used to display the success toast
  const [successMessage, setSuccessMessage] = useState(""); // Create the message state variable

  //used to display the warning toast
  const [warningMessage, setWarningMessage] = useState(""); // Create the message state variable

  //used to display the error toast
  const [errorMessage, setErrorMessage] = useState(""); // Create the message state variable

  const API = `http://localhost:8080/api`;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  //Used to display the success Toast
  useEffect(() => {
    if (successMessage) {
      console.log(`from Inquiry.jsx : ${successMessage}`);

      toast.success(successMessage, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
      });
      // Reset successMessage after showing the toast
      setSuccessMessage("");
    }
  }, [successMessage]); // Toast only shows when successMessage changes

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

  // Used to display the error Toast
  useEffect(() => {
    if (errorMessage) {
      console.log(`from Inquiry.jsx : ${errorMessage}`);

      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
      });
      // Reset errorMessage after showing the toast
      setErrorMessage("");
    }
  }, [errorMessage]); // Toast only shows when errorMessage changes

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API}/cart/user/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch cart");

        const data = await res.json();
        console.log("Cart Response:", data.result);
        setCart(data.result);
        setUserInfo(data.result.userId);

        //console.log("Cart:", cart);
      } catch (err) {
        setError("Could not load cart");
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleBookingSubmit = async () => {
    if (!deliveryAddress) {
      //alert("Please enter a delivery address.");
      setWarningMessage("Please enter a delivery address.");
      return;
    }

    const bookingData = {
      itemsList: cart.itemsList.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: cart.totalPrice,
      rentalDate: cart.rentalDate,
      deliveryAddress,
      eventNotes,
    };

    console.log("Booking Data:", bookingData);
    // Send booking data to the backend
    try {
      const res = await fetch(`${API}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Booking failed");
      }

      // alert("Booking successful!");
      setSuccessMessage("Booking successful!"); // Set the success message state variable

      // Optionally redirect or clear cart
    } catch (err) {
      console.error(err);
      //alert("Error: " + err.message);
      setErrorMessage("Error: " + err.message); // Set the error message state variable
    }

    // Delete the cart after booking
    try {
      const res = await fetch(`${API}/cart/${cart._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete cart");
      }
      console.log("Cart deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
      setErrorMessage("Error: " + err.message); // Set the error message state variable
    }

    //clear cartItemCount from localStorage
    localStorage.setItem("cartItemCount", 0);
    // Optionally, you can clear the cart state
    setCart(null);

    setUpdateCart((prev) => !prev);

    // Redirect to My Bookings page
    navigate("/my-bookings");
  };

  if (loading) return <p>Loading...</p>;
  if (error || !cart) return <p>{error || "Cart is empty"}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Booking Details</h2> */}

      <h2 className="text-2xl font-bold mb-4">Your Rental Booking</h2>

      {userInfo && (
        <div className="mb-4">
          <p className="font-semibold">
            User: {userInfo.firstName} {userInfo.lastName}
          </p>
          <p>Email: {userInfo.email}</p>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <strong>Rental Date:</strong>{" "}
        {new Date(cart.rentalDate).toLocaleDateString("en-US")}
      </div>

      {/* <div className="mb-4"> */}
      <div className="space-y-4">
        {cart.itemsList.map((item, i) => {
          console.log(item);
          return (
            //   <li key={item.productId}>
            //     {item.productId.name} - Qty: {item.quantity}
            //   </li>
            <div
              key={item._id}
              className="flex items-center justify-between bg-white shadow p-4 rounded"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.productId.imageUrl}
                  alt={item.productId.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold text-lg">
                    {item.productId.name}
                  </h3>
                  <p>
                    Rental Date:{" "}
                    {new Date(cart.rentalDate).toLocaleDateString("en-US")}
                  </p>
                  <p className="text-gray-600">
                    Price: ${item.productId.price} x {item.quantity}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  ${item.productId.price * item.quantity}
                </p>
              </div>
            </div>
          );
        })}
        <div className="text-right text-xl font-bold pt-4 border-t">
          Total: ${cart.totalPrice.toFixed(2)}
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Delivery Address</label>
        <textarea
          className="textarea textarea-bordered w-full"
          rows="3"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          //****** ONLY For Demo --- Start
          onClick={(e) => {
            e.target.value = "112 Parker Ave, Manasquan, NJ 08736";
          }}
          //****** ONLY For Demo --- End
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Event Notes (optional)</label>
        <textarea
          className="textarea textarea-bordered w-full"
          rows="2"
          value={eventNotes}
          onChange={(e) => setEventNotes(e.target.value)}
        />
      </div>

      <button className="btn btn-primary" onClick={handleBookingSubmit}>
        Confirm Booking
      </button>
    </div>
  );
};

export default Booking;
