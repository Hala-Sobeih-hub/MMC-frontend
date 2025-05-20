import React, { useState } from "react";
import Logo from "../../assets/images/mmc-inflatable-logo.png";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/users/password/forgot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Failed to send reset password email");
            }

            setMessage("A reset password link has been sent to your email.");
        } catch (err) {
            console.error(err);
            setError("Failed to send reset password email. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200 ">

            <div className="card w-full max-w-lg shadow-xl bg-base-100">

                <div className="card-body p-17">
                    <div className="flex justify-center mb-6">
                        <img src={Logo} alt="MMC Inflatables Logo" className="w-58 h-58 object-cover rounded-full" />
                    </div>

                    <h1 className="text-2xl font-bold text-center text-white pb-4">Forgot Password</h1>
                    <form onSubmit={handleSubmit} className="space-y-15">
                        <div className="form-control">
                            <label className="label ">
                                <span className="label-text text-2xl pb-4">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input input-bordered text-xl"
                                required
                            />
                        </div>
                        <button type="submit" className=" button-default btn btn-primary w-full hover:text-teal-600 ">
                            Send Reset Link
                        </button>
                    </form>
                    {message && <p className="text-white text-center text-2xl mt-4">{message}</p>}
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;