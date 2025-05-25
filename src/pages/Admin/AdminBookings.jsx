import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/mmc-inflatable-logo.png";
import { useNavigate } from "react-router-dom";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingToBeUpdated, setBookingToBeUpdated] = useState(null);

  const [updatedDeliveryAddress, setUpdatedDeliveryAddress] = useState("");
  const [updatedEventNotes, setUpdatedEventNotes] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedRentalDate, setUpdatedRentalDate] = useState("");

  const API = `http://localhost:8080/api`;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    //if token expires, redirect to Login
    if (!token) {
      navigate("/login"); // Redirect to login if token is missing
    }
  }, [navigate]);

  useEffect(() => {
    //fetch all bookings
    fetchBookings();
  }, []);

  // Fetch all bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/booking/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
      });
      const data = await response.json();
      setBookings(data.result);
      console.log("Bookings", data.result);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch bookings.");
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`${API}/booking/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }

      const data = await response.json();
      console.log("Booking status updated:", data.result);
      fetchBookings(); // Refresh bookings after updating
    } catch (err) {
      console.error(err);
      setError("Failed to update booking status.");
    }
  };

  // Update booking details
  const updateBooking = async (bookingId) => {
    try {
      const response = await fetch(`${API}/booking/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify({
          deliveryAddress: updatedDeliveryAddress,
          eventNotes: updatedEventNotes,
          status: updatedStatus,
          rentalDate: updatedRentalDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking");
      }

      const data = await response.json();
      console.log("Booking updated:", data.result);
      fetchBookings(); // Refresh bookings after updating
    } catch (err) {
      console.error(err);
      setError("Failed to update booking.");
    }
  };

  const deleteBooking = async (bookingId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirm) return;
    try {
      const response = await fetch(`${API}/booking/${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
      });

      if (!response.ok) throw new Error("Failed to delete booking");

      const data = await response.json();
      console.log("Booking deleted:", data.result);
      fetchBookings(); // Refresh bookings after deletion
    } catch (err) {
      console.error(err);
      setError("Failed to delete booking.");
    }
  };

  return (
    <div className="p-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src={Logo}
          alt="MMC Inflatables Logo"
          className="w-32 h-32 object-cover rounded-full"
        />
      </div>

      <h1 className="text-3xl font-bold mb-6">Admin Management</h1>

      {/* All bookings */}
      <h2 className="text-2xl font-bold mb-4">All Bookings</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Rental Date</th>
            <th className="border border-gray-300 px-4 py-2">Products</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id} className="text-center">
              <td
                className="border border-gray-300 px-4 py-2"
                onClick={() => setSelectedBooking(booking)}
                onMouseOver={(e) => {
                  e.currentTarget.style.cursor = "pointer";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.cursor = "default";
                }}
              >
                {booking.userId.firstName} {booking.userId.lastName}
              </td>
              <td
                className="border border-gray-300 px-4 py-2"
                onClick={() => setSelectedBooking(booking)}
                onMouseOver={(e) => {
                  e.currentTarget.style.cursor = "pointer";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.cursor = "default";
                }}
              >
                {new Date(booking.rentalDate).toLocaleDateString()}
              </td>
              <td
                className="border border-gray-300 w-120 px-4 py-2"
                onClick={() => setSelectedBooking(booking)}
                onMouseOver={(e) => {
                  e.currentTarget.style.cursor = "pointer";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.cursor = "default";
                }}
              >
                {booking.itemsList.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center text-left gap-4 mb-2"
                  >
                    <img
                      src={item.productId.imageUrl}
                      alt={item.productId.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold text-lg text-left">
                        {/* {item.productId.name}  */}
                        {/* limit the number of characters of the name */}
                        {item.productId.name.length > 40
                          ? item.productId.name.substring(0, 40) + "..."
                          : item.productId.name}
                      </p>
                      <p className="text-gray-600">
                        Price: ${item.productId.price} x {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </td>

              <td className="border border-gray-300 px-4 py-2">
                <select
                  value={booking.status}
                  onChange={(e) =>
                    handleStatusChange(booking._id, e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {/* Edit button> */}
                <button
                  className="button-default px-4 py-2 rounded"
                  onClick={() => {
                    setBookingToBeUpdated(booking);
                    setUpdatedDeliveryAddress(booking.deliveryAddress);
                    setUpdatedEventNotes(booking.eventNotes);
                    setUpdatedStatus(booking.status);
                    setUpdatedRentalDate(
                      new Date(booking.rentalDate).toLocaleDateString()
                    );
                  }}
                >
                  Edit
                </button>{" "}
                <button
                  onClick={() => deleteBooking(booking._id)}
                  className="button-default px-4 py-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* show pop up modal with booking details */}
      {selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-10">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
            <p>
              <strong>Name:</strong> {selectedBooking.userId.firstName}{" "}
              {selectedBooking.userId.lastName}
            </p>
            <p>
              <strong>Rental Date:</strong>{" "}
              {new Date(selectedBooking.rentalDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {selectedBooking.status}
            </p>
            <p>
              <strong>Delivery Address:</strong>{" "}
              {selectedBooking.deliveryAddress}
            </p>
            <p>
              <strong>Event Notes:</strong> {selectedBooking.eventNotes}
            </p>
            <h3 className="text-lg font-semibold border-b mt-6 pb-2">Items:</h3>
            <div className="space-y-4">
              {selectedBooking.itemsList.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.productId.imageUrl}
                      alt={item.productId.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-semibold text-lg">
                        {item.productId.name}
                      </h4>
                      <p className="text-gray-600">
                        ${item.productId.price} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-bold">
                    ${item.productId.price * item.quantity}
                  </div>
                </div>
              ))}
              <div className="text-right text-xl font-bold pt-4 border-t">
                Total: $
                {selectedBooking.itemsList.reduce(
                  (total, item) => total + item.productId.price * item.quantity,
                  0
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for Updating booking details */}
      {bookingToBeUpdated && (
        // inset-0: Stretches the <div> to cover the full screen
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-180">
            <h2 className="text-xl font-bold mb-4">Update Booking</h2>

            <div className="flex flex-col gap-2">
              {/* Booking Information can not be changed by the Admin */}
              <div className="flex gap-x-6">
                <strong className="w-1/4 text-gray-700 text-right">
                  Name:
                </strong>
                <p className="w-3/4 px-4 text-left">
                  {bookingToBeUpdated.userId.firstName}{" "}
                  {bookingToBeUpdated.userId.lastName}
                </p>
              </div>
              <div className="flex gap-x-6">
                <strong className="w-1/4 text-gray-700 text-right">
                  Rental Date:
                </strong>
                <input
                  type="text"
                  value={updatedRentalDate}
                  onChange={(e) => setUpdatedRentalDate(e.target.value)}
                  placeholder="MM/DD/YYYY"
                  className="w-3/4 px-4"
                />
              </div>
              <div className="flex gap-x-6">
                <strong className="w-1/4 text-gray-700 text-right">
                  Status:
                </strong>
                <select
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                  className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>

                  <option value="Completed">Completed</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>

              <div className="flex gap-x-6">
                <strong className="w-1/4 text-gray-700 text-right">
                  Delivery Address:
                </strong>
                <textarea
                  id="deliveryAddress"
                  className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  //placeholder="Enter your address"
                  value={updatedDeliveryAddress}
                  rows="3"
                  onChange={(e) => {
                    setUpdatedDeliveryAddress(e.target.value);
                    console.log(updatedDeliveryAddress);
                  }}
                  //****** ONLY For Demo --- Start
                  // onClick={(e) => {
                  //   e.target.value = "123 Main St, City, State, ZIP";
                  // }}
                  //****** ONLY For Demo --- End
                ></textarea>
              </div>
              <div className="flex gap-x-6">
                <strong className="w-1/4 text-gray-700 text-right">
                  Event Notes:
                </strong>

                <textarea
                  id="eventNotes"
                  className="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  //placeholder="Enter your notes"
                  value={updatedEventNotes}
                  rows="3"
                  onChange={(e) => {
                    setUpdatedEventNotes(e.target.value);
                    console.log(updatedEventNotes);
                  }}
                  //****** ONLY For Demo --- Start
                  // onClick={(e) => {
                  //   e.target.value =
                  //     "Customer was called and appointment was scheduled.";
                  // }}
                  //****** ONLY For Demo --- End
                ></textarea>
              </div>
              <div className="flex gap-x-6">
                <strong className="w-1/4 text-gray-700 text-right">
                  Items:
                </strong>
                <div className="w-3/4 px-4">
                  {bookingToBeUpdated.itemsList.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.productId.imageUrl}
                          alt={item.productId.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-semibold text-lg">
                            {item.productId.name}
                          </h4>
                          <p className="text-gray-600">
                            ${item.productId.price} x {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right font-bold">
                        ${item.productId.price * item.quantity}
                      </div>
                    </div>
                  ))}
                  <div className="text-right text-xl font-bold pt-4 border-t">
                    Total: $
                    {bookingToBeUpdated.itemsList.reduce(
                      (total, item) =>
                        total + item.productId.price * item.quantity,
                      0
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-x-6 flex-row-reverse mt-4 justify-center">
                <button
                  className="w-1/3 bg-[#4a9cd3] text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-300"
                  onClick={() => setBookingToBeUpdated(null)}
                >
                  Cancel
                </button>
                <button
                  className="w-1/3 bg-[#4a9cd3] text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-300"
                  onClick={() => {
                    updateBooking(bookingToBeUpdated._id);
                    setBookingToBeUpdated(null); // Close modal
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
