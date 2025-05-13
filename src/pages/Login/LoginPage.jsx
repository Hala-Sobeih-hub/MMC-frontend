import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Username</span>
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
                            <span className="label-text">Password</span>
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
                    <button type="submit" className="btn btn-primary w-full">
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