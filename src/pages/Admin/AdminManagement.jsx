import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/mmc-inflatable-logo.png";

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [deletionRequests, setDeletionRequests] = useState([]);

    useEffect(() => {
        // Fetch all admins
        fetch("http://localhost:8080/api/users/all")
            .then((res) => res.json())
            .then((data) => setAdmins(data))
            .catch((err) => console.error(err));

        // Fetch deletion requests
        fetch("http://localhost:8080/api/users/deletion-requests")
            .then((res) => res.json())
            .then((data) => setDeletionRequests(data))
            .catch((err) => console.error(err));
    }, []);

    const handleDelete = async (adminId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/admin/deletion`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ adminId }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete admin");
            }

            alert("Admin deleted successfully");
            setAdmins(admins.filter((admin) => admin.id !== adminId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete admin. Please try again.");
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Management</h1>
            <h2 className="text-2xl font-bold mb-4">Admins</h2>
            <ul>
                {admins.map((admin) => (
                    <li key={admin.id} className="flex justify-between items-center mb-4">
                        <span>{admin.name}</span>
                        <button
                            onClick={() => handleDelete(admin.id)}
                            className="btn btn-error"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Deletion Requests</h2>
            <ul>
                {deletionRequests.map((request) => (
                    <li key={request.id} className="mb-4">
                        <span>{request.reason}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminManagement;