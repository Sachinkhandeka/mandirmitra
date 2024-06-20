import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { Button, Label, TextInput, Spinner, Alert } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { signinStart, signinSuccess, signinFailure, resetError } from "../redux/user/userSlice";
import { Helmet } from "react-helmet-async";

export default function SigninUser({ setShowComponent }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.user);
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [viewPass, setViewPass] = useState(false);

    // handleChange - formData
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value.trim(),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(signinStart());

        if (!formData.email || !formData.password) {
            dispatch(signinFailure("Please fill out all the fields"));
            return;
        }
        try {
            const response = await fetch(
                "/api/user/signin",
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
            dispatch(signinSuccess(data.rest));
            navigate("/");
        } catch (err) {
            dispatch(signinFailure(err.message));
        }
    };

    return (
        <section className="flex flex-col gap-4 w-full md:py-6 bg-white md:min-h-40 rounded-lg md:border md:border-blue-500 pt-1 p-10">
            <Helmet>
                <title>User Sign In - MandirMitra</title>
                <meta name="description" content="Sign in as a user created by the Super Admin to access your specific functionalities and manage your activities through MandirMitra." />
                <meta name="keywords" content="MandirMitra, User Sign In, Temple Management, Secure Login" />
            </Helmet>
            <div className="w-full">
                {error && (
                    <Alert color={"failure"} onDismiss={() => dispatch(resetError())}>
                        {error}
                    </Alert>
                )}
                <div className="text-gray-800">
                    <h1 className="text-gray-800 font-bold text-2xl font-serif">Login with User</h1>
                </div>
                <form onSubmit={handleSubmit} className="text-gray-800">
                    <div className="flex flex-col gap-4 my-4">
                        <Label htmlFor="email" className="text-gray-800">Email:</Label>
                        <TextInput
                            type="email"
                            id="email"
                            name="email"
                            placeholder="eg. user@gmail.com"
                            onChange={handleChange}
                            required
                            className="bg-gray-200 text-gray-800 placeholder-gray-500"
                        />
                    </div>
                    <div className="flex flex-col gap-4 relative">
                        <Label htmlFor="password" className="text-gray-800">Password:</Label>
                        <TextInput
                            type={`${viewPass ? 'text' : 'password'}`}
                            id="password"
                            name="password"
                            placeholder="************"
                            onChange={handleChange}
                            required
                            className="bg-gray-200 text-gray-800 placeholder-gray-500"
                        />
                        <span className="absolute right-4 top-12 cursor-pointer text-gray-800" onClick={() => setViewPass(!viewPass)}>
                            {viewPass ? <FaRegEyeSlash /> : <FaRegEye />}
                        </span>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        gradientDuoTone={"purpleToBlue"}
                        outline
                        className="w-full my-8"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <Spinner /> : 'Login'}
                    </Button>
                </form>
            </div>
            <div className='flex items-center justify-center gap-2 mt-2 border-t border-t-gray-500 relative' >
                <span className=' absolute top-[-15px] px-4 bg-white' >or</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-black'>
                Login with OTP ?
                <span className='text-blue-500 hover:underline'>
                    <Link to="#" onClick={() => setShowComponent('phoneInput')}>Click here</Link>
                </span>
            </div>
            <div className='flex items-center gap-2 text-sm text-black'>
                Login with superAdmin email?
                <span className='text-blue-500 hover:underline'>
                    <Link to="#" onClick={() => setShowComponent('signinSuperAdmin')}>Click here</Link>
                </span>
            </div>
        </section>
    );
}
