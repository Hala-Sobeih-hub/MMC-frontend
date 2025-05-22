import React, { useState } from "react";
import Logo from "../../assets/images/mmc-inflatable-logo.png";

const AdminInvitation = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/users/invite-admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Failed to send admin invitation");
            }

            setMessage("Admin invitation sent successfully.");
        } catch (err) {
            console.error(err);
            setError("Failed to send admin invitation. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="card w-full max-w-md shadow-xl bg-base-100">
                <div className="card-body p-16">
                    {/* <div className="flex justify-center mb-6">
                        <img src={Logo} alt="MMC Inflatables Logo" className="w-50 h-50 object-cover rounded-full" />
                    </div> */}
                    <h1 className="text-2xl font-bold text-center text-white pb-3">Invite Admin</h1>
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-lg">Admin Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter admin email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input input-bordered"
                                required
                            />
                        </div>
                        <button type="submit" className="button-default btn btn-primary w-full">
                            Send Invitation
                        </button>
                    </form>
                    {message && <p className="text-green-500 text-center mt-4">{message}</p>}
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminInvitation;