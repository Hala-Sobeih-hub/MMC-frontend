import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/mmc-inflatable-logo.png";

export default function AdminManagement() {
    const [users, setUsers] = useState([]);
    const [deletionRequests, setDeletionRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [bookings, setBookings] = useState([]);
    const [products, setProducts] = useState([]);
    const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
    const [confirmedBookingsCount, setConfirmedBookingsCount] = useState(0);
    const [completedBookingsCount, setCompletedBookingsCount] = useState(0);
    const [canceledBookingsCount, setCanceledBookingsCount] = useState(0);

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
        //fetch all users and deletion requests
        fetchUsersAndRequests();
        //fetch bookings
        fetchBookings();
        //fetch products
        fetchProducts();
    }, []);

    // Fetch all users and deletion requests
    const fetchUsersAndRequests = async () => {
        setLoading(true);
        try {
            // Fetch all users
            const usersResponse = await fetch(`${API}/users/all`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token for authentication
                },
            });
            const usersData = await usersResponse.json();
            setUsers(usersData.AllUsers);
            console.log("Users", usersData.AllUsers);
            // Fetch deletion requests
            const requestsResponse = await fetch(`${API}/users/deletion-requests`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token for authentication
                },
            });
            const requestsData = await requestsResponse.json();
            setDeletionRequests(requestsData.pendingRequests);

            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch data.");
            setLoading(false);
        }
    };

    // Fetch bookings
    const fetchBookings = async () => {
        try {
            const res = await fetch(`${API}/booking/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to fetch bookings");

            const data = await res.json();
            setBookings(data.result);

            // Calculate count of booking with status 'Pending'
            const pendingBookings = data.result.filter(
                (booking) => booking.status === "Pending"
            ).length;

            //console.log("Count of pendingBookings:", pendingBookings);
            setPendingBookingsCount(pendingBookings); // Update the state with the count

            // Calculate count of booking with status 'Confirmed'
            const confirmedBookings = data.result.filter(
                (booking) => booking.status === "Confirmed"
            ).length;

            //console.log("Count of pendingBookings:", pendingBookings);
            setConfirmedBookingsCount(confirmedBookings); // Update the state with the count

            // Calculate count of booking with status 'Completed'
            const completedBookings = data.result.filter(
                (booking) => booking.status === "Completed"
            ).length;
            //console.log("Count of pendingBookings:", pendingBookings);
            setCompletedBookingsCount(completedBookings); // Update the state with the count
            // Calculate count of booking with status 'Canceled'
            const canceledBookings = data.result.filter(
                (booking) => booking.status === "Canceled"
            ).length;
            //console.log("Count of pendingBookings:", pendingBookings);
            setCanceledBookingsCount(canceledBookings); // Update the state with the count
        } catch (err) {
            setError("Could not load bookings");
        }
    };

    // Fetch products
    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API}/products`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to fetch products");

            const data = await res.json();
            setProducts(data);
        } catch (err) {
            setError("Could not load products");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Logo */}
            <div className="flex justify-center p-8">
                <img
                    src={Logo}
                    alt="MMC Inflatables Logo"
                    className="w-32 h-32 object-cover rounded-full"
                />
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-center my-8">
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
                {/* User Accounts button> */}
                <button
                    className="button-default rounded-lg p-5 text-xl bg-accent text-white hover:cursor-pointer shadow-md transition 
               transform hover:scale-105 hover:shadow-lg "
                    onClick={() => navigate("/admin/users")}
                >
                    <span className="text-2xl font-bold">User Accounts </span>
                    <br />
                    <span className="text-lg mt-2">{users.length}</span>
                    <br />
                </button>
                {/* Available Products button> */}
                <button
                    className="button-default rounded-lg p-5 text-xl bg-accent text-white hover:cursor-pointer shadow-md transition 
               transform hover:scale-105 hover:shadow-lg "
                    onClick={() => navigate("/admin/products")}
                >
                    <span className="text-2xl font-bold">Available Products </span>
                    <br /> <span className="text-lg">{products.length}</span> <br />{" "}
                </button>

                {/* Add Product Button
        <button
          className="button-default rounded-lg p-3 text-xl bg-accent text-white hover:cursor-pointer shadow-md transition 
               transform hover:scale-105 hover:shadow-lg "
          onClick={() => navigate("/admin/products/add-product")}
        >
          <span className="text-2xl font-bold">Add Product</span>
        </button> */}

                {/* Bookings */}
                <button
                    // className="action-button rounded-lg p-3 text-xl bg-accent text-white"
                    className="button-default rounded-lg p-3 text-xl bg-accent text-white  hover:cursor-pointer
               shadow-md transition 
               transform hover:scale-105 hover:shadow-lg "
                    onClick={() => navigate("/admin/bookings")}
                >
                    <span className="text-2xl font-bold">Bookings</span>{" "}
                    {/* Larger font for "Bookings" */}
                    <br />
                    <span className="text-lg mt-2">
                        {" "}
                        ⏳ Pending: {pendingBookingsCount}
                    </span>{" "}
                    <br /> {/* Smaller font for the count */}
                    <span className="text-lg mt-1">
                        {" "}
                        ✅ Confirmed: {confirmedBookingsCount}
                    </span>{" "}
                    <br />
                    <span className="text-lg mt-1">
                        📦 Completed: {completedBookingsCount}
                    </span>
                    <br />
                    <span className="text-lg mt-1">
                        ❌ Canceled: {canceledBookingsCount}
                    </span>
                </button>
            </div>

            <p>
                <br />
            </p>
        </div>
    );
}
