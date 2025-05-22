import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import bounceImage1 from "../../assets/images/bounce-image-1.jpg";
// import bounceImage2 from "../../assets/images/bounce-image-2.jpg";
// import bounceImage3 from "../../assets/images/bounce-image-3.jpg";
// import Logo from "../../assets/images/mmc-inflatable-logo.png";

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    // const [isSignup, setIsSignup] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const [showPassword, setShowPassword] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState({
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
    });

    const [errorMsg, setErrorMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility

    // const [currentImage, setCurrentImage] = useState(0);
    const navigate = useNavigate();

    // const backgroundImages = [bounceImage1, bounceImage2, bounceImage3];

    // // Change the background image every 5 seconds
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCurrentImage((prevImage) => (prevImage + 1) % backgroundImages.length);
    //     }, 5000); // 5000ms = 5 seconds

    //     return () => clearInterval(interval); // Cleanup interval on component unmount
    // }, [backgroundImages.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const endpoint = isLogin
                ? "http://localhost:8080/api/users/login"
                : "http://localhost:8080/api/users/signup";

            const body = isLogin
                ? { username, password }
                : { firstName, lastName, email, username, password, phoneNumber, deliveryAddress };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            // console.log("Response:", response);
            if (!response.ok) {
                throw new Error(isLogin ? "Login failed" : "Signup failed");
            }

            const data = await response.json();
            console.log("Data:", data);

            if (isLogin) {
                localStorage.setItem("token", data.Token);
                localStorage.setItem("Auth", data.User.isAdmin);
                navigate("/");


            } else {
                alert("Signup successful! Please log in.");
                setIsLogin(true); // Switch to login form after signup
            }

            localStorage.setItem("token", data.Token);
            navigate("/");
        } catch (err) {
            console.log(err);
            setErrorMsg(err.message);
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen w-screen bg-cover bg-center bg-secondary  overflow-y-auto"
        // style={{
        //     backgroundImage: `url(${backgroundImages[currentImage]})`,
        //     transition: "background-image 0.5s ease-in-out",
        // }}
        >
            <div className="w-full max-w-xl p-8 space-y-6 bg-secondary ">
                {/* <div className="flex justify-center">
                    <img src={Logo} alt="MMC Inflatables Logo" className="max-w-[20em] h-[20em] object-cover rounded-full" />
                </div> */}
                <h1 className="text-3xl font-bold text-center text-white">{isLogin ? "Login" : "Signup"}</h1>
                {/* <div className='flex justify-center space-x-4 mb-4'>
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`btn ${isLogin ? "btn-primary" : "btn-outline"}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`btn ${!isLogin ? "btn-primary" : "btn-outline"}`}
                    >
                        Signup
                    </button>

                </div> */}
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


                    {/* Shared fields for both Login and Signup */}
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
                            onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {/* Error message */}
                    {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
                    {/* Submit button */}
                    <button type="submit" className="button-default btn btn-primary w-full text-xl
                    hover:text-teal-600">
                        {isLogin ? "Login" : "Signup"}
                    </button>
                </form>
                {isLogin && (
                    <p className="text-center">
                        Don't have an account?{" "}
                        <button
                            onClick={() => setIsLogin(false)}
                            className="text-neutral hover:text-teal-700 
                            hover:underline
                            cursor-pointer"
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
                            className="text-neutral hover:text-teal-700 
                            hover:underline
                            cursor-pointer"
                        >
                            Login here
                        </button>
                    </p>
                )}
                <p className="text-center">
                    <button
                        onClick={() => navigate("/password/forgot")}
                        className="text-neutral hover:text-teal-700 
                        hover:underline
                        cursor-pointer"
                    >
                        Forgot Password?
                    </button>
                </p>
            </div>
        </div>
    );
};


export default LoginPage