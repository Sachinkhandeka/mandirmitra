import React, { useState, Suspense } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import "../css/PhoneInputCostom.css";
import { Button, Spinner } from 'flowbite-react';
import Alert from '../components/Alert';
import OtpInput from "../components/OtpInput";
import { app } from '../firebase';
import { RecaptchaVerifier, getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { signinSuccess, signinFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import CreateDevotee from "./CreateDevotee";
import brand from "../assets/brand.jpg";
import { IoHomeOutline } from "react-icons/io5";

export default function Devotees() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ type : "", message : "" });
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [showComponent, setShowComponent] = useState('phoneInput'); // 'phoneInput', 'otpInput', 'createDevotee'
    const auth = getAuth(app);

    // Set up reCAPTCHA and request OTP
    const setUpReacptcha = async (phoneNumber) => {
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {});
        await recaptchaVerifier.render();
        return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    };

    const handleOnChange = (value, { dialCode = '' }) => {
        setPhoneNumber(`+${dialCode}${value.slice(dialCode.length)}`);
    };

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if(!password) { 
            setAlert({ type : "error", message : "Please enter password" });
            return setLoading(false);
        }

        const regex = /[^0-9]/g;
        const strippedPhoneNumber = phoneNumber.replace(regex, '');
        if (strippedPhoneNumber.length < 10 || regex.test(strippedPhoneNumber)) {
            setAlert({ type : "error", message : "Invalid Phone Number" });
            setLoading(false);
            return;
        }

        try {
            const response = await setUpReacptcha(phoneNumber);
            setConfirmationResult(response);
            setShowComponent('otpInput');
        } catch (error) {
            setAlert({ type : "error", message : error.message });
            setLoading(false);
        }
    };

    const onOtpSubmit = async (combinedOtp) => {
        if (confirmationResult) {
            try {
                const result = await confirmationResult.confirm(combinedOtp);
                const phoneNumber = result.user.phoneNumber;
                await logInWithPhoneNumber(phoneNumber);
            } catch (error) {
                setAlert({ type : "error", message : error.message });
            }
        }
    };

    const logInWithPhoneNumber = async (phoneNumber) => {

        if(!password) { 
            setAlert({ type : "info", message : "Please enter password" });
            return setLoading(false);
        }
        try {
            const response = await fetch("/api/devotee/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                dispatch(signinFailure(data.message));
                setAlert({ type : "error", message : data.message });
                setLoading(false);
                return;
            }

            if (data.needsSignup) {
                localStorage.setItem('signupPhoneNumber', phoneNumber);
                setShowComponent('createDevotee');
            } else {
                dispatch(signinSuccess(data.currUser));
                navigate("/");
            }
        } catch (error) {
            setAlert({ type : "error", message :error.message });
        }
    };
    return (
        <>
        {/* Helmet for SEO Meta Tags and Structured Data */}
        <Helmet>
            <title>Devotee Login and Signup | MandirMitra</title>
            <meta
                name="description"
                content="Login or create an account to stay connected with your temple through MandirMitra. Discover temple history, events, and manage your profile."
            />
            <meta
                name="keywords"
                content="devotee login, signup, MandirMitra, temple app, phone verification, temple management"
            />
            <meta property="og:title" content="Devotee Login and Signup | MandirMitra" />
            <meta property="og:description" content="Login or create an account to stay connected with your temple through MandirMitra. Get OTP verification and join the temple community." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://www.mandirmitra.co.in/devotees" />
            <meta property="og:image" content={brand} />

            {/* Structured Data for Login Page */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "Devotee Login and Signup",
                    "description": "Login or sign up to access temple details, manage your profile, and stay connected with your temple.",
                    "url": "https://www.mandirmitra.co.in/devotees",
                    "potentialAction": {
                        "@type": "RegisterAction",
                        "target": "https://www.mandirmitra.co.in/devotees",
                        "result": {
                            "@type": "LoginAction",
                            "name": "Phone Number Login"
                        }
                    }
                })}
            </script>
        </Helmet>
        <section className="phone-otp-section w-full bg-white h-screen flex flex-col md:flex-row items-center md:bg-gradient-to-tr md:from-blue-400 md:via-sky-600 md:to-indigo-800">
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                )}
            </div>
            <div className="flex flex-col items-center justify-center gap-2 p-4 md:hidden">
                <img src={brand} alt="brand_image" className='h-16 w-16 border-2 rounded-md' />
                <span className='text-xs font-serif text-gray-500'>mandirmitra</span>
            </div>
            <div className="hidden md:flex md:w-1/2 flex-col p-12">
                <p className="text-white md:text-4xl lg:text-6xl font-bold italic">
                    Stay Connected to Your Faith, Anytime, Anywhere
                </p>
                <p className="mb-3 text-white text-md font-bold my-4">
                    MandirMitra helps you stay close to your temple no matter where you live. Discover temple history, festivals, pujaris, and management details all in one place.
                </p>
            </div>
            {showComponent === "phoneInput" && (
                <div className="flex flex-col gap-4 w-full md:max-w-md md:py-6 bg-white md:min-h-40 rounded-lg md:border md:border-blue-500 md:pt-1 md:p-10" >
                    <h1 className='text-black font-bold text-2xl font-serif md:hidden px-4'>Log in or create an account</h1>
                    <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                        {alert && alert.message && (
                            <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                        )}
                    </div>
                    <h1 className='text-black font-bold text-4xl font-serif hidden md:block pt-4'>Login / Signup</h1>
                    <h2 className='text-gray-500 md:text-black text-sm font-serif md:font-bold px-8 md:px-1'>Please enter your phone number to continue</h2>
                    <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4 px-8 md:px-1 w-full">
                        <PhoneInput
                            country={'in'}
                            value={phoneNumber}
                            onChange={handleOnChange}
                            placeholder="Enter Phone Number"
                            containerClass="custom-phone-input-container"
                            inputClass="custom-phone-input"
                            buttonClass="custom-dropdown-button"
                            dropdownClass="custom-dropdown-container"
                            searchClass="custom-search-field"
                        />
                        <div className="flex flex-col gap-2 text-black" >
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password"
                                id="password"
                                name="password"
                                placeholder="******"
                                value={password}
                                onChange={(e)=> setPassword(e.target.value)}
                                className="text-black bg-white border border-gray-200 p-4 shadow-lg hover:shadow-xl rounded-md"
                            />
                        </div>
                        <div id='recaptcha-container' className='my-2' />
                        <div>
                            <Button type="submit" color={`${phoneNumber.length >= 10 ? 'warning' : 'light'}`} disabled={phoneNumber.length < 10 || loading}>
                                {loading ? <Spinner color={"warning"} aria-label="loading indicator" /> : 'Send verification code'}
                            </Button>
                        </div>
                    </form>
                    <div className='flex items-center gap-2 text-sm text-gray-600 hover:text-blue-500 hover:underline pl-8 md:pl-2'>
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>
                    <Link 
                        to={"/"}
                        className="text-gray-500 hover:text-black cursor-pointer underline flex items-center gap-1 pl-8 md:pl-2"
                    >
                        <IoHomeOutline /> 
                        <span>Home</span>
                    </Link>
                </div>
            )}
            {showComponent === "otpInput" && (
                <div className="flex flex-col gap-4 w-full md:max-w-md md:py-6 bg-white md:min-h-40 rounded-lg md:border md:border-blue-500 md:pt-1 md:p-10" >
                    <h2 className='text-2xl font-bold text-black px-4'>Enter OTP</h2>
                    <p className="text-lg text-black font-medium px-4">We have sent a temporary passcode to you at {phoneNumber}</p>
                    <div className="w-full px-10 max-w-md text-black">
                        <OtpInput length={6} onOtpSubmit={onOtpSubmit} />
                    </div>
                    <p className='text-sm text-gray-500'>* Do not share this OTP with anyone as it is confidential.</p>
                </div>
            )}
            {showComponent === 'createDevotee' && (
                <Suspense fallback={<div className='flex items-center justify-center'><Spinner color="purple" aria-label="Loading spinner example" /></div>}>
                    <CreateDevotee />
                </Suspense>
            )}
        </section>
        </>
    );
}
