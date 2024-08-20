import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { Button, Label, TextInput, Spinner } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { signinStart, signinSuccess, signinFailure, resetError } from "../redux/user/userSlice";
import { Helmet } from "react-helmet-async";
import OAuth from "../components/OAuth";
import Alert from "../components/Alert";

export default function CreateSuperAdmin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.user);
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
    }

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
            const response = await fetch(
                "/api/superadmin/create",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                dispatch(signinFailure(data.message));
                return;
            }
            dispatch(signinSuccess(data.currUser));
            navigate("/");
        } catch (err) {
            dispatch(signinFailure(err.message));
        }
    }

    return (
        <>
            <Helmet>
                <title>Create Super Admin - MandirMitra</title>
                <meta name="description" content="Create a super admin for your temple on MandirMitra and manage all activities efficiently." />
                <meta name="keywords" content="MandirMitra, mandirmitra, mandir mitra, super admin, temple management, create super admin" />
            </Helmet>
            <div className="relative flex flex-col gap-4 w-full max-w-md py-6 bg-white rounded-lg md:border md:border-blue-500 p-10">
                <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {error && ( <Alert type="error" message={error} autoDismiss duration={6000} onClose={() => dispatch(resetError())} /> )}
                </div>
                <div className="text-black">
                    <h1 className="text-2xl font-mono font-bold uppercase">Create Super Admin</h1>
                </div>
                <form onSubmit={handleSubmit} className="px-8" >
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="username" className="text-black">Username</Label>
                        <TextInput
                            type="text"
                            id="username"
                            name="username"
                            placeholder="e.g., superAdmin_001"
                            onChange={handleChange}
                            required
                            className="rounded-lg bg-gray-200"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="text-black">Email</Label>
                        <TextInput
                            type="email"
                            id="email"
                            name="email"
                            placeholder="e.g., superAdmin@gmail.com"
                            onChange={handleChange}
                            required
                            className="rounded-lg bg-gray-200"
                        />
                    </div>
                    <div className="flex flex-col gap-2 relative">
                        <Label htmlFor="password" className="text-black">Password</Label>
                        <TextInput
                            type={`${viewPass ? 'text' : 'password'}`}
                            id="password"
                            name="password"
                            placeholder="************"
                            onChange={handleChange}
                            required
                            className="rounded-lg bg-gray-200"
                        />
                        <span className="absolute right-4 top-9 cursor-pointer text-gray-500" onClick={() => setViewPass(!viewPass)}>
                            {viewPass ? <FaRegEyeSlash /> : <FaRegEye />}
                        </span>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        gradientDuoTone={"purpleToBlue"}
                        outline
                        className="w-full my-2"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <Spinner /> : 'Create'}
                    </Button>
                    <OAuth templeId={templeId} />
                </form>
            </div>
        </>
    );
}
