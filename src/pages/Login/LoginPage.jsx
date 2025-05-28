import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import bounceImage1 from "../../assets/images/bounce-image-1.jpg";
// import bounceImage2 from "../../assets/images/bounce-image-2.jpg";
// import bounceImage3 from "../../assets/images/bounce-image-3.jpg";
// import Logo from "../../assets/images/mmc-inflatable-logo.png";


const LoginPage = ({ updateToken }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState({
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
    });

    // Signup-specific states
    const [signupPassword, setSignupPassword] = useState("");
    const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
    const [signupShowPassword, setSignupShowPassword] = useState(false);
    const [signupShowConfirmPassword, setSignupShowConfirmPassword] = useState(false);
    const [signupPasswordStrength, setSignupPasswordStrength] = useState("");
    const [signupError, setSignupError] = useState("");

    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    // Password strength calculation
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[@$!%*?&]/.test(password)) strength++;
        if (strength === 5) return "Strong";
        if (strength >= 3) return "Medium";
        return "Weak";
    };

    const handleSignupPasswordChange = (e) => {
        const value = e.target.value;
        setSignupPassword(value);
        setSignupPasswordStrength(calculatePasswordStrength(value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSignupError("");
        setErrorMsg("");

        if (!isLogin) {
            if (signupPassword !== signupConfirmPassword) {
                setSignupError("Passwords do not match");
                return;
            }
        }

        try {
            const endpoint = isLogin
                ? "http://localhost:8080/api/users/login"
                : "http://localhost:8080/api/users/signup";

            const body = isLogin
                ? { username, password }
                : {
                    firstName,
                    lastName,
                    email,
                    username,
                    password: signupPassword,
                    phoneNumber,
                    deliveryAddress
                };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(isLogin ? "Login failed" : "Signup failed");
            }

            const data = await response.json();

            if (isLogin) {
                updateToken(data.Token, data.User.isAdmin);
                navigate("/");
            } else {
                alert("Signup successful! Please log in.");
                setIsLogin(true);
                navigate("/");
            }
        } catch (err) {
            setErrorMsg(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-screen bg-cover bg-center bg-secondary overflow-y-auto">
            <div className="w-full max-w-xl p-8 space-y-6 bg-secondary ">
                <h1 className="text-3xl font-bold text-center text-white">{isLogin ? "Login" : "Signup"}</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Signup-specific fields */}
                    {!isLogin && (
                        <>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-xl">First Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your first name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-xl">Last Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-xl">Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-xl">Phone Number</span>
                                </label>
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-xl">Street Address</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your street address"
                                    value={deliveryAddress.streetAddress}
                                    onChange={(e) =>
                                        setDeliveryAddress((prev) => ({
                                            ...prev,
                                            streetAddress: e.target.value,
                                        }))
                                    }
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-xl">City</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your city"
                                    value={deliveryAddress.city}
                                    onChange={(e) =>
                                        setDeliveryAddress((prev) => ({
                                            ...prev,
                                            city: e.target.value,
                                        }))
                                    }
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-xl">State</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your state"
                                    value={deliveryAddress.state}
                                    onChange={(e) =>
                                        setDeliveryAddress((prev) => ({
                                            ...prev,
                                            state: e.target.value,
                                        }))
                                    }
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-xl">Postal Code</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your postal code"
                                    value={deliveryAddress.postalCode}
                                    onChange={(e) =>
                                        setDeliveryAddress((prev) => ({
                                            ...prev,
                                            postalCode: e.target.value,
                                        }))
                                    }
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* Login Username and Password */}
                    {isLogin && (
                        <>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-xl">Username</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="form-control relative">
                                <label className="label">
                                    <span className="label-text text-xl">Password</span>
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input input-bordered w-full"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-8.5 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Username, Password, Confirm Password for Signup - AT THE BOTTOM */}
                    {!isLogin && (
                        <>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-xl">Username</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div className="form-control relative">
                                <label className="label">
                                    <span className="label-text text-xl">Password</span>
                                </label>
                                <input
                                    type={signupShowPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={signupPassword}
                                    onChange={handleSignupPasswordChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-8.5 text-gray-500"
                                    onClick={() => setSignupShowPassword(!signupShowPassword)}
                                >
                                    {signupShowPassword ? "Hide" : "Show"}
                                </button>
                                {/* Password Strength Indicator - only show if password is not empty */}
                                {signupPassword.length > 0 && (
                                    <div className="mt-2">
                                        <div
                                            className={`h-2 rounded transition-all ${signupPasswordStrength === "Strong"
                                                ? "bg-green-600 w-full"
                                                : signupPasswordStrength === "Medium"
                                                    ? "bg-yellow-500 w-2/3"
                                                    : "bg-red-500 w-1/3"
                                                }`}
                                        ></div>
                                        <p className="text-sm mt-1">
                                            Strength:{" "}
                                            <span
                                                className={`font-bold ${signupPasswordStrength === "Strong"
                                                    ? "text-green-800"
                                                    : signupPasswordStrength === "Medium"
                                                        ? "text-yellow-500"
                                                        : "text-red-500"
                                                    }`}
                                            >
                                                {signupPasswordStrength || "Weak"}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="form-control relative">
                                <label className="label">
                                    <span className="label-text text-xl">Confirm Password</span>
                                </label>
                                <input
                                    type={signupShowConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={signupConfirmPassword}
                                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                                    className="input input-bordered w-full"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-8.5 text-gray-500"
                                    onClick={() => setSignupShowConfirmPassword(!signupShowConfirmPassword)}
                                >
                                    {signupShowConfirmPassword ? "Hide" : "Show"}
                                </button>
                                {/* Password match indicator */}
                                {signupConfirmPassword && (
                                    <p className={`mt-1 text-sm ${signupPassword === signupConfirmPassword ? "text-green-600" : "text-red-500"}`}>
                                        {signupPassword === signupConfirmPassword ? "Passwords match" : "Passwords do not match"}
                                    </p>
                                )}
                            </div>
                            <div className="justify-items-center">
                                <p className="text-gray-700 text-center text-md">
                                    Password must be at least 8 characters long and include at least one uppercase letter,
                                    one lowercase letter, one number, and one special character.
                                </p>
                            </div>
                        </>
                    )}

                    {/* Error message */}
                    {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
                    {signupError && <p className="text-red-500 text-sm">{signupError}</p>}
                    {/* Submit button */}
                    <button type="submit" className="button-default btn btn-primary w-full text-xl hover:text-teal-600">
                        {isLogin ? "Login" : "Signup"}
                    </button>
                </form>
                {isLogin && (
                    <p className="text-center">
                        Don't have an account?{" "}
                        <button
                            onClick={() => setIsLogin(false)}
                            className="text-neutral hover:text-teal-700 hover:underline cursor-pointer"
                        >
                            Signup here
                        </button>
                    </p>
                )}
                {!isLogin && (
                    <p className="text-center">
                        Already have an account?{" "}
                        <button
                            onClick={() => setIsLogin(true)}
                            className="text-neutral hover:text-teal-700 hover:underline cursor-pointer"
                        >
                            Login here
                        </button>
                    </p>
                )}
                <p className="text-center">
                    <button
                        onClick={() => navigate("/password/forgot")}
                        className="text-neutral hover:text-teal-700 hover:underline cursor-pointer"
                    >
                        Forgot Password?
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;