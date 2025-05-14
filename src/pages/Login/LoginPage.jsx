import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import bounceImage1 from "../../assets/images/bounce-image-1.jpg";
// import bounceImage2 from "../../assets/images/bounce-image-2.jpg";
// import bounceImage3 from "../../assets/images/bounce-image-3.jpg";
import Logo from "../../assets/images/mmc-inflatable-logo.png";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
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
            const response = await fetch("http://localhost:8080/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            // console.log("Response:", response);
            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            console.log("Data:", data);
            localStorage.setItem("token", data.Token);
            navigate("/");
        } catch (err) {
            console.log(err);
            setErrorMsg(err.message);
        }
    }
    return (
        <div className="flex items-center justify-center h-screen w-screen bg-cover bg-center bg-secondary"
        // style={{
        //     backgroundImage: `url(${backgroundImages[currentImage]})`,
        //     transition: "background-image 0.5s ease-in-out",
        // }}
        >
            <div className="w-full max-w-xl p-8 space-y-6 bg-secondary ">
                <div className="flex justify-center">
                    <img src={Logo} alt="MMC Inflatables Logo" className="h-6rem w-auto" />
                </div>
                <h1 className="text-3xl font-bold text-center text-white">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-xl">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
                    <button type="submit" className="btn btn-primary w-full text-xl ">
                        Login
                    </button>
                </form>
                <p className="text-center">
                    Forgot your password?{" "}
                    <a href="/forgot-password" className="text-blue-500 hover:underline">
                        Reset it here
                    </a>
                </p>
            </div>
        </div>
    );
};


export default LoginPage