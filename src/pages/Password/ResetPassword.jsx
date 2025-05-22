import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/mmc-inflatable-logo.png";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(""); // Track password strength
    const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password visibility
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();


    const email = searchParams.get("email");

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        // Calculate password strength
        const strength = calculatePasswordStrength(value);
        setPasswordStrength(strength);
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;

        // Check for length
        if (password.length >= 8) strength++;

        // Check for uppercase letters
        if (/[A-Z]/.test(password)) strength++;

        // Check for lowercase letters
        if (/[a-z]/.test(password)) strength++;

        // Check for numbers
        if (/\d/.test(password)) strength++;

        // Check for special characters
        if (/[@$!%*?&]/.test(password)) strength++;

        // Return strength level
        if (strength === 5) return "Strong";
        if (strength >= 3) return "Medium";
        return "Weak";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/users/password/reset/${window.location.pathname.split("/")[3]}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newPassword: password }),
            });


            if (!response.ok) {
                const data = await response.json();
                // Display the backend's specific error message
                if (data.message) {
                    setError(data.message); // Display the backend message
                } else {
                    throw new Error("Failed to reset password");
                }
                return;
            }

            setMessage("Your password has been reset successfully.");
            setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to reset password. Please try again.");
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
                        {/* New Password Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-lg">New Password</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} // Toggle input type
                                    placeholder="Enter your new password"
                                    value={password}
                                    onChange={handlePasswordChange} // Use the password change handler
                                    className="input input-bordered w-full"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {/* Password Strength Indicator */}
                            <div className="mt-2">
                                <div
                                    className={`h-2 rounded transition-all ${passwordStrength === "Strong"
                                        ? "bg-green-600 w-full"
                                        : passwordStrength === "Medium"
                                            ? "bg-yellow-500 w-2/3"
                                            : "bg-red-500 w-1/3"
                                        }`}
                                ></div>
                                <p className="text-sm mt-1">
                                    Strength:{" "}
                                    <span
                                        className={`font-bold ${passwordStrength === "Strong"
                                            ? "text-green-800"
                                            : passwordStrength === "Medium"
                                                ? "text-yellow-500"
                                                : "text-red-500"
                                            }`}
                                    >
                                        {passwordStrength || "Weak"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-lg">Confirm Password</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"} // Toggle input type
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input input-bordered w-full"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3 text-gray-500"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div className="justify-items-center">
                            <p className="text-white text-center text-md">
                                Password must be at least 8 characters long and include at least one uppercase letter,
                                one lowercase letter, one number, and one special character.
                            </p>
                        </div>
                        <button type="submit" className="button-default btn btn-primary w-full">
                            Reset Password
                        </button>
                    </form>
                    {message && <p className="text-green-800 text-center mt-4">{message}</p>}
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;