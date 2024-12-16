import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { FiEye, FiEyeOff } from "react-icons/fi"; 
import Alert from "../components/Alert";
import { IoHomeOutline } from "react-icons/io5";
import brand from "../assets/brand.jpg";

export default function ResetPassword() {
    const navigate = useNavigate();
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            setAlert({ type: "info", message: "Please provide password and confirm password!" });
            return;
        }
        if (password !== confirmPassword) {
            setAlert({ type: "info", message: "Passwords do not match!" });
            return;
        }
        setAlert({ type: "", message: "" });
        setLoading(true);

        try {
            const response = await fetch(`/api/auth/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, confirmPassword }),
            });
            const data = await response.json();

            if (!response.ok) {
                if (data.message === "jwt expired") {
                    setAlert({ type: "error", message: "Token expired. Please try to reset password again" });
                    setTimeout(() => {
                        navigate("/forgot-password");
                    }, 2000);
                    return;
                }
                setAlert({ type: "error", message: data.message });
                return;
            }

            setAlert({ type: "success", message: "Password reset successfully!" });
            setTimeout(() => {
                if (data && data.model === "Devotee") {
                    navigate("/devotees");
                } else {
                    navigate("/login");
                }
            }, 1000);
        } catch (error) {
            setAlert({ type: "error", message: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPass = (e)=> {
        if (e.target.value !== password) {
            setAlert({ type: "error", message: "Passwords do not match!" });
        }else {
            setAlert({ type: "success", message: "Passwords match!" });
        }
        setConfirmPassword(e.target.value);
    }

    return (
        <div className="relative flex items-center flex-col md:justify-center min-h-screen md:bg-gradient-to-tr md:from-blue-400 md:via-sky-600 md:to-indigo-800">
            <div className="flex flex-col items-center justify-center gap-2 p-4 md:hidden">
                <img src={brand} alt="brand_image" className='h-16 w-16 border-2 rounded-md' />
                <span className='text-xs font-serif text-gray-500'>mandirmitra</span>
            </div>
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        autoDismiss={false}
                        onClose={() => setAlert({ type: "", message: "" })}
                    />
                )}
            </div>
            {/* Card */}
            <div className="relative z-10 w-full max-w-lg p-8 bg-white rounded-lg md:shadow-lg">
                <h2 className="text-3xl font-bold text-gray-700">Reset Password</h2>
                <p className="mt-2 text-gray-500">Enter and confirm your new password.</p>
                <form onSubmit={handleSubmit} className="my-6 space-y-4">
                    {/* Password Input */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="w-full p-3 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-10 right-4 text-gray-500 focus:outline-none"
                        >
                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="relative">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            className="w-full p-3 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => handleConfirmPass(e)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute top-10 right-4 text-gray-500 focus:outline-none"
                        >
                            {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        disabled={loading}
                    >
                        {loading ? <Spinner size="sm" /> : "Reset Password"}
                    </button>
                </form>
                <Link 
                    to={"/"}
                    className="text-gray-500 hover:text-black cursor-pointer underline flex items-center gap-1"
                >
                    <IoHomeOutline /> 
                    <span>Home</span>
                </Link>
            </div>
        </div>
    );
}
