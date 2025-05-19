import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Logo from "../../assets/images/mmc-inflatable-logo.png";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();

    const email = searchParams.get("email");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/users/password/reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Failed to reset password");
            }

            setMessage("Your password has been reset successfully.");
        } catch (err) {
            console.error(err);
            setError("Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="card w-full max-w-md shadow-xl bg-base-100">
                <div className="card-body p-16">
                    <div className="flex justify-center mb-6">
                        <img src={Logo} alt="MMC Inflatables Logo" className="w-54 h-54 object-cover rounded-full" />
                    </div>


                    <h1 className="text-2xl font-bold text-center text-white pb-3">Reset Password</h1>
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-lg">New Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input input-bordered"
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-lg">Confirm Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input input-bordered"
                                required
                            />
                        </div>
                        <button type="submit" className="button-default btn btn-primary w-full">
                            Reset Password
                        </button>
                    </form>
                    {message && <p className="text-green-500 text-center mt-4">{message}</p>}
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;