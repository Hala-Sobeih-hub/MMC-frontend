import React, { useEffect, useState } from "react";
import profilePlaceholder from "../assets/images/empty-profile-pic.jpg";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

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

    // // Handle account deletion request
    // const handleDeleteRequest = async () => {
    //     try {
    //         const response = await fetch("http://localhost:8080/api/users/request-deletion", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ username: user.username }),
    //         });
    //         if (response.ok) {
    //             alert("Your account deletion request has been sent to the admin.");
    //         } else {
    //             alert("Failed to send deletion request.");
    //         }
    //     } catch (err) {
    //         alert("An error occurred while sending the request.");
    //     }
    // };

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
                    {/* <button
                        type="button"
                        className="text-red-600 hover:text-red-800 hover:underline cursor-pointer mt-2"
                        onClick={handleDeleteRequest}
                    >
                        Request Account Deletion
                    </button> */}
                </div>
            )}
            <h2 className="text-xl font-semibold mb-2">My Bookings</h2>
            <button
                type="button"
                className="btn btn-secondary mt-2"
                onClick={() => navigate("/my-bookings")}
            >
                View Previous Bookings
            </button>
        </div>
    );
};

export default UserAccount;