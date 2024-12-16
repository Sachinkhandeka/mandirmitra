import React from "react";
import { useState } from "react";
import Alert from "../components/Alert";
import { Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import brand from "../assets/brand.jpg";

export default function ForgotPassword () {
    const [email, setEmail] = useState("");
    const [alert, setAlert] = useState({ type : "", message : "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setAlert({ type: "info", message: "Please provide your email to proceed" });
            return;
        }

        setLoading(true);
        setAlert({ type : "", message : "" });
        try {

            const response = await fetch(
                '/api/auth/forgot-password', 
                { 
                    method : "POST",
                    headers : { "Content-Type" : "application/json" },
                    body : JSON.stringify({ email })  
                }
            );
            const data = await response.json();

            if(!response.ok) {
                return setAlert({ type : "error", message : data.message || "Something went wrong. Please try again" });
            }
            setAlert({ type : "success", message : data.message });
        
        } catch (error) {
            setAlert({ type : "error", message : error.message || "Something went wrong. Please try again" });
        } finally {
            setLoading(false);
        }
    };

return (
    <div className="relative flex items-center flex-col md:justify-center min-h-screen md:bg-gradient-to-tr md:from-blue-400 md:via-sky-600 md:to-indigo-800">
        <div className="flex flex-col items-center justify-center gap-2 p-4 md:hidden">
            <img src={brand} alt="brand_image" className='h-16 w-16 border-2 rounded-md' />
            <span className='text-xs font-serif text-gray-500'>mandirmitra</span>
        </div>
        <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
            {alert && alert.message && (
                <Alert type={alert.type} message={alert.message} autoDismiss={false} onClose={() => setAlert({ type: "", message: "" })} />
            )}
        </div>

        {/* Card */}
        <div className="w-full max-w-lg p-8 bg-white rounded-lg md:shadow-lg ">
            <h2 className="text-3xl font-bold text-gray-700">Forgot Password?</h2>
            <p className="mt-2 text-gray-500">No worries, we'll send you reset password instructions.</p>

            <form onSubmit={handleSubmit} className="my-6 space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full p-3 mt-1 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    disabled={loading}
                >
                    { loading ? <Spinner size="sm" /> : 'Send Reset Email' }
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
};
