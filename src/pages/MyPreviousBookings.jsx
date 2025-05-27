import React, { useEffect, useState } from "react";
//importing Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyPreviousBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [expandedBookingIds, setExpandedBookingIds] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [editedAddresses, setEditedAddresses] = useState({});

  //used to display the success toast
  const [successMessage, setSuccessMessage] = useState(""); // Create the message state variable

  //used to display the warning toast
  const [warningMessage, setWarningMessage] = useState(""); // Create the message state variable

  //used to display the error toast
  const [errorMessage, setErrorMessage] = useState(""); // Create the message state variable

  const API = `http://localhost:8080/api/booking`;
  const token = localStorage.getItem("token");

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

  // Fetch bookings when the component mounts
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`${API}/my-bookings/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch bookings");

        const data = await res.json();
        setBookings(data.result);
      } catch (err) {
        setError("Could not load bookings");
      }
    };

    fetchBooking();
  }, []);

  /* Keeps track of which bookings are expanded using the expandedBookingIds state (an array of booking IDs).
     If the clicked booking is already expanded (its ID is in the array), remove it to collapse.
     If it's not expanded, add the ID to the array.*/
  const toggleExpand = (id) => {
    setExpandedBookingIds((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  /* Sets editMode[bookingId] = true so you can conditionally show the input field instead of plain text.
     Pre-fills the input with the current delivery address by setting editedAddresses[bookingId].*/
  const handleEditClick = (id, currentAddress) => {
    setEditMode((prev) => ({ ...prev, [id]: true }));
    setEditedAddresses((prev) => ({ ...prev, [id]: currentAddress }));
  };

  /* Updates editedAddresses[bookingId] with the new value the user typed.
     This ensures the input field stays in sync with state.*/
  const handleAddressChange = (id, value) => {
    setEditedAddresses((prev) => ({ ...prev, [id]: value }));
  };

  /* Sends a PUT request to the backend with the new delivery address.
     If successful:
        Updates the bookings list in state with the new address.
        Exits edit mode by setting editMode[bookingId] = false.*/
  const handleSaveClick = async (id) => {
    try {
      console.log("Edited Address:", editedAddresses[id]);
      const res = await fetch(`${API}/${id}/update-address`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deliveryAddress: editedAddresses[id] }),
      });

      if (!res.ok) throw new Error("Failed to update address");

      const updated = await res.json();

      console.log("Updated Booking:", updated);

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id
            ? { ...booking, deliveryAddress: updated.result.deliveryAddress }
            : booking
        )
      );
      setEditMode((prev) => ({ ...prev, [id]: false }));
      setSuccessMessage("Address updated successfully.");
    } catch (err) {
      alert("Failed to update address.");
      setErrorMessage("Failed to update address.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return "✅ Confirmed";
      case "Pending":
        return "⏳ Pending";
      case "Canceled":
        return "❌ Canceled";
      default:
        return "📦 Completed";
    }
  };

  const handleCancelBooking = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(`${API}/cancel/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to cancel booking");

      const updated = await res.json();

      console.log("Updated Booking:", updated);

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? updated.result : b))
      );
      setSuccessMessage("Booking canceled successfully.");
    } catch (err) {
      //alert("Could not cancel booking. It may be too late.");
      setErrorMessage("Could not cancel booking. It may be too late.");
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Previous Bookings</h1>
      {error && <p className="text-red-500">{error}</p>}
      {bookings.length === 0 && <p>No bookings found.</p>}

      {bookings.map((booking) => {
        const isExpanded = expandedBookingIds.includes(booking._id);
        return (
          <div
            key={booking._id}
            className="bg-white shadow-md rounded-lg p-6 mb-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Booking #{booking._id.slice(-6).toUpperCase()}{" "}
                <span className="ml-2">{getStatusIcon(booking.status)}</span>
              </h2>
              <button
                onClick={() => toggleExpand(booking._id)}
                className="btn btn-primary underline"
              >
                {isExpanded ? "Collapse" : "Expand"}
              </button>
            </div>

            {isExpanded && (
              <>
                <div className="mt-4">
                  <p className="text-gray-500">
                    Rental Date:{" "}
                    {new Date(booking.rentalDate).toLocaleDateString()}
                  </p>

                  <div className="mt-2">
                    <p className="font-semibold">Delivery Address:</p>
                    {editMode[booking._id] ? (
                      <>
                        <input
                          type="text"
                          className="border p-2 w-full"
                          value={editedAddresses[booking._id] || ""}
                          onChange={(e) =>
                            handleAddressChange(booking._id, e.target.value)
                          }
                        />
                        <button
                          className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
                          onClick={() => handleSaveClick(booking._id)}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <p>{booking.deliveryAddress}</p>
                        <button
                          className="btn btn-primary underline mt-1"
                          onClick={() =>
                            handleEditClick(
                              booking._id,
                              booking.deliveryAddress
                            )
                          }
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>

                  {/* Cancel button if booking is <30 min old and not canceled */}
                  {booking.status !== "canceled" &&
                    new Date() - new Date(booking.createdAt) <
                      30 * 60 * 1000 && (
                      <div className="text-right mt-4">
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}

                  {booking.eventNotes && (
                    <div className="mt-2">
                      <p className="font-semibold">Event Notes:</p>
                      <p>{booking.eventNotes}</p>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold border-b mt-6 pb-2">
                  Items:
                </h3>
                <div className="space-y-4">
                  {booking.itemsList.map((item) => (
                    <div
                      key={item.productId?._id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.productId?.imageUrl}
                          alt={item.productId?.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-semibold text-lg">
                            {item.productId?.name}
                          </h4>
                          <p className="text-gray-600">
                            ${item.productId?.price} x {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right font-bold">
                        ${item.productId?.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-right text-xl font-bold pt-4 border-t mt-4">
                  Total: ${booking.totalPrice.toFixed(2)}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
