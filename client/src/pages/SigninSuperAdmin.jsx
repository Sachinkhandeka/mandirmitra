import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { MdOutlineMobileFriendly, MdMarkEmailRead } from "react-icons/md";
import { Button, Label, TextInput, Spinner } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { signinStart, signinSuccess, signinFailure, resetError } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import Alert from "../components/Alert";

export default function SigninSuperAdmin({ setShowComponent }) {
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
            dispatch(signinStart());
            const response = await fetch(
                "/api/superadmin/signin",
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
            navigate("/dashboard");
        } catch (err) {
            dispatch(signinFailure(err.message));
        }
    };
    
    return (
        <section className="flex flex-col gap-4 w-full md:py-6 bg-white md:min-h-40 rounded-lg text-black p-10 md:p-0">
            <Helmet>
                <title>Super Admin Sign In - mandirmitra</title> 
                <meta name="description" content="Sign in as a Super Admin to manage and oversee all temple activities, donations, events, and more through mandirmitra." />
                <meta name="keywords" content="mandirmitra, MandirMitra, mandir mitra, Super Admin Sign In, Temple Management, Donations, Events, Secure Login" />
            </Helmet>
            <div>
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {error && ( <Alert type="error" message={error} autoDismiss duration={6000} onClose={() => dispatch(resetError())} /> )}
            </div>
                <div className="whitespace-nowrap ">
                    <h1 className="text-2xl font-serif font-bold">Login with Admin</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4 my-1">
                        <Label htmlFor="email" className="dark:text-black" >Email:</Label>
                        <TextInput
                            type="email"
                            id="email"
                            name="email"
                            className="dark:bg-white text-black"
                            placeholder="eg. superAdmin@gmail.com"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-4 my-2 relative">
                        <Label htmlFor="password" className="dark:text-black" >Password:</Label>
                        <TextInput
                            type={`${viewPass ? 'text' : 'password'}`}
                            id="password"
                            name="password"
                            className="dark:bg-white text-black"
                            placeholder="************"
                            onChange={handleChange}
                            required
                        />
                        <span className="absolute right-4 top-12 cursor-pointer" onClick={() => setViewPass(!viewPass)}>
                            {viewPass ? <FaRegEyeSlash /> : <FaRegEye />}
                        </span>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        gradientDuoTone={"purpleToBlue"}
                        outline
                        className="w-full my-4"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <Spinner /> : 'Login'}
                    </Button>
                    <OAuth />
                </form>
            </div>
            <div className='flex items-center gap-1 text-sm text-gray-600 hover:text-blue-500 hover:underline px-2'>
                <Link to="/forgot-password">Forgot password?</Link>
            </div>
            <div className='flex items-center justify-center mt-2 border-t border-t-gray-500 relative' >
                <span className=' absolute top-[-15px] px-4 bg-white text-black' >or</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 px-2 text-xs">
                {/* Login with OTP Button */}
                <button 
                    onClick={() => setShowComponent('phoneInput')} 
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-indigo-500 text-white rounded-md shadow-lg hover:bg-indigo-600 transition-colors duration-300 focus:outline-none"
                >
                    <MdOutlineMobileFriendly size={22} />
                    <span>Login with OTP</span>
                </button>

                {/* Login with User Email Button */}
                <button 
                    onClick={() => setShowComponent('signin')} 
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none"
                >
                    <MdMarkEmailRead size={26} />
                    <span>Login with user email</span>
                </button>
            </div>
        </section>
    );
}
