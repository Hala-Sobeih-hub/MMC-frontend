import React, { useEffect, useState } from "react";
import profilePlaceholder from "../assets/images/empty-profile-pic.jpg";

const UserAccount = ({ setUser, user }) => {
    const [bookings, setBookings] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        deliveryAddress: "",
        profilePic: "",
    });
    const [uploading, setUploading] = useState(false);

    const token = localStorage.getItem("token");
    const API = "http://localhost:8080/api";

    useEffect(() => {
        fetch(`${API}/users/my-profile`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setUser(data.result);
                setForm({
                    firstName: data.result.firstName || "",
                    lastName: data.result.lastName || "",
                    email: data.result.email || "",
                    phoneNumber: data.result.phoneNumber || "",
                    deliveryAddress: data.result.deliveryAddress?.streetAddress || "",
                    profilePic: data.result.profilePic || "",
                });
            });

        fetch(`${API}/booking/my-bookings`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setBookings(data.result || []));
    }, [token, setUser]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle file upload
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("profilePic", file);

        const res = await fetch(`${API}/users/upload-profile-pic`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        const data = await res.json();
        setForm((prev) => ({ ...prev, profilePic: data.url }));
        setUploading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API}/users/update-profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        setUser((prev) => ({ ...prev, ...form, profilePic: form.profilePic }));
        setEditMode(false);
    };

    if (!user) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">My Account</h1>
            {editMode ? (
                <form onSubmit={handleSave} className="space-y-2 mb-6">
                    <div className="flex items-center space-x-4">
                        <img
                            src={
                                form.profilePic
                                    ? form.profilePic.startsWith("/uploads")
                                        ? `http://localhost:8080${form.profilePic}`
                                        : form.profilePic
                                    : profilePlaceholder
                            }
                            alt="Profile Preview"
                            className="w-24 h-24 rounded-full object-cover "
                        />
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input file-input-bordered w-full"
                                disabled={uploading}
                            />
                            {uploading && <div>Uploading...</div>}
                        </div>
                    </div>
                    <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="input input-bordered w-full" />
                    <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="input input-bordered w-full" />
                    <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input input-bordered w-full" />
                    <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="input input-bordered w-full" />
                    <input name="deliveryAddress" value={form.deliveryAddress} onChange={handleChange} placeholder="Delivery Address" className="input input-bordered w-full" />
                    <button type="submit" className="btn btn-secondary mt-2">Save</button>
                    <button type="button" className="btn btn-secondary ml-2" onClick={() => setEditMode(false)}>Cancel</button>
                </form>
            ) : (
                <div className="mb-6 flex justify-center items-center flex-col space-y-2">
                    <img
                        src={
                            user?.profilePic && typeof user.profilePic === "string" && user.profilePic.trim() !== ""
                                ? user.profilePic.startsWith("/uploads")
                                    ? `http://localhost:8080${user.profilePic}`
                                    : user.profilePic
                                : profilePlaceholder
                        }
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div><strong>Name:</strong> {user.firstName} {user.lastName}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Phone:</strong> {user.phoneNumber}</div>
                    <div><strong>Address:</strong> {user.deliveryAddress?.streetAddress || user.deliveryAddress}</div>
                    <button className="btn btn-secondary mt-2" onClick={() => setEditMode(true)}>Edit Profile</button>
                </div>
            )}
            <h2 className="text-xl font-semibold mb-2">My Bookings</h2>
            <ul className="space-y-2">
                {bookings.length === 0 && <li>No bookings found.</li>}
                {bookings.map((booking) => (
                    <li key={booking._id} className="border p-2 rounded">
                        <div><strong>Product:</strong> {booking.productName}</div>
                        <div><strong>Date:</strong> {booking.rentalDate}</div>
                        <div><strong>Status:</strong> {booking.status}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserAccount;