import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { Spinner } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { signinStart, signinSuccess, signinFailure, resetError } from "../redux/user/userSlice";
import { Helmet } from "react-helmet-async";
import OAuth from "../components/OAuth";
import Alert from "../components/Alert";

export default function CreateSuperAdmin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.user);
    const templeId = localStorage.getItem("templeId");

    useEffect(() => {
        if (!templeId) {
            navigate("/login");
        }
    }, [templeId, navigate]);

    const [formData, setFormData] = useState({
        templeId: templeId,
        username: "",
        email: "",
        password: "",
        phoneNumber: localStorage.getItem("signupPhoneNumber"),
    });
    const [viewPass, setViewPass] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value.trim(),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(signinStart());
        if (!formData.templeId) {
            return dispatch(signinFailure("Cannot create super admin without templeId"));
        }
        if (!formData.username || !formData.email || !formData.password) {
            return dispatch(signinFailure("Please fill out all the fields"));
        }
        try {
            dispatch(signinStart());
            const response = await fetch("/api/superadmin/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (!response.ok) {
                dispatch(signinFailure(data.message));
                return;
            }
            dispatch(signinSuccess(data.currUser));
            navigate("/dashboard");
        } catch (err) {
            dispatch(signinFailure(err.message));
        }
    };

    return (
        <>
            <Helmet>
                <title>Create Super Admin - MandirMitra</title>
                <meta
                    name="description"
                    content="Create a super admin for your temple on MandirMitra and manage all activities efficiently."
                />
                <meta
                    name="keywords"
                    content="mandirmitra, MandirMitra, mandir mitra, super admin, temple management, create super admin"
                />
            </Helmet>

            <div className="flex flex-col gap-6 w-full text-gray-800">
                {/* Alert Notification */}
                {error && (
                    <Alert
                        type="error"
                        message={error}
                        autoDismiss
                        duration={6000}
                        onClose={() => dispatch(resetError())}
                    />
                )}

                {/* Title Section */}
                <div className="text-center py-6">
                    <h1 className="text-2xl font-bold text-gray-900 uppercase">Create Super Admin</h1>
                    <p className="text-xs text-gray-600 mt-1">
                        Set up a Super Admin account to manage your temple activities.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 px-10 md:px-0">
                    {/* Username Field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="username" className="text-sm font-medium text-black">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-black">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2 relative">
                        <label htmlFor="password" className="text-sm font-medium text-black">
                            Password
                        </label>
                        <input
                            type={viewPass ? "text" : "password"}
                            id="password"
                            name="password"
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                        <span
                            className="absolute right-4 top-1/2 cursor-pointer text-gray-500 hover:text-blue-500 transition"
                            onClick={() => setViewPass(!viewPass)}
                        >
                            {viewPass ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                        </span>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 transition-all"
                    >
                        {loading ? <Spinner size="sm" /> : "Create Super Admin"}
                    </button>

                    {/* OAuth Section */}
                    <OAuth templeId={templeId} />
                </form>
            </div>
        </>
    );
}
