import React, { useState, Suspense } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Spinner } from 'flowbite-react';
import OtpInput from '../components/OtpInput';
import { app } from '../firebase';
import { RecaptchaVerifier, getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import brand from "../assets/brand.jpg";
import "../css/PhoneInputCostom.css";
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { signinSuccess, signinFailure } from '../redux/user/userSlice';
import Alert from '../components/Alert';

const SignupSuperAdmin = React.lazy(() => import("./SignupSuperAdmin"));
const SigninUser = React.lazy(() => import("./SigninUser"));
const CreateSuperAdmin = React.lazy(() => import("./CreateSuperAdmin"));
const SigninSuperAdmin = React.lazy(()=> import("./SigninSuperAdmin"));

export default function PhoneOtpForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState(null);
    const [showComponent, setShowComponent] = useState('phoneInput'); // 'phoneInput', 'otpInput', 'addTemple', 'signin', 'createSuperAdmin', 'signinSuperAdmin'
    const [loading, setLoading] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const auth = getAuth(app);

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

        const regex = /[^0-9]/g;
        const strippedPhoneNumber = phoneNumber.replace(regex, '');
        if (strippedPhoneNumber.length < 10 || regex.test(strippedPhoneNumber)) {
            alert('Invalid Phone Number');
            setLoading(false);
            return;
        }

        try {
            const response = await setUpReacptcha(phoneNumber);
            setConfirmationResult(response);
            setShowComponent('otpInput');
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const onOtpSubmit = async (combinedOtp) => {
        if (confirmationResult) {
            try {
                const result = await confirmationResult.confirm(combinedOtp);
                const phoneNumber = result.user.phoneNumber;
                await LogInWithPhoneNumber(phoneNumber);
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const LogInWithPhoneNumber = async (phoneNumber) => {
        try {
            const response = await fetch(
                '/api/superadmin/login',
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ phoneNumber: phoneNumber }),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                dispatch(signinFailure(data.message));
                console.log(data.message);
                setLoading(false);
                return;
            }

            if (data.needsSignup) {
                localStorage.setItem('signupPhoneNumber', phoneNumber);
                setShowComponent('addTemple');
            } else {
                dispatch(signinSuccess(data.currUser));
                navigate("/");
            }
        } catch (err) {
            dispatch(signinFailure(err.message));
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <section className="phone-otp-section w-full bg-white h-screen flex flex-col md:flex-row items-center md:bg-gradient-to-tr md:from-blue-400 md:via-sky-600 md:to-indigo-800">
            <Helmet>
                <title>MandirMitra - Phone OTP Verification</title>
                <meta name="description" content="MandirMitra helps you manage temple activities with ease and grace. Enter your phone number to log in or create a new account." />
                <meta name="keywords" content="MandirMitra,mandirmitra, mandir mitra, Temple Management, OTP Verification, Phone Login" />
                <meta name="author" content="MandirMitra Team" />
            </Helmet>
            <div className="flex flex-col items-center justify-center gap-2 p-4 md:hidden">
                <img src={brand} alt="brand_image" className='h-16 w-16 border-2 rounded-md' />
                <span className='text-xs font-serif text-gray-500' >MandirMitra</span>
            </div>
            <div className="hidden md:flex md:w-1/2 flex-col p-12">
                <p className="text-white md:text-4xl lg:text-6xl font-bold italic">"Managing Temple Activities with Ease and Grace."</p>
                <p className="text-white md:text-2xl lg:text-4xl font-bold italic p-6">- MandirMitra</p>
            </div>
            <div className="flex flex-col gap-4 w-full md:max-w-md md:py-6 bg-white md:min-h-40 rounded-lg md:border md:border-blue-500 md:pt-1 md:p-10">
                {showComponent === 'phoneInput' && (
                    <>
                        <h1 className='text-black font-bold text-2xl font-serif md:hidden px-4'>Log in or create an account</h1>
                        <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                            {error && ( <Alert type="error" message={error} autoDismiss duration={6000} onClose={() => setError(null)} /> )}
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
                            <div id='recaptcha-container' className='my-2' />
                            <div>
                                <Button type="submit" color={`${phoneNumber.length >= 10 ? 'warning' : 'light'}`} disabled={phoneNumber.length < 10 || loading}>
                                    {loading ? <Spinner color={"warning"} /> : 'Send verification code'}
                                </Button>
                            </div>
                        </form>
                        <div className='flex items-center justify-center gap-2 mt-2 border-t border-t-gray-500 relative mx-6' >
                            <span className='absolute top-[-15px] px-4 bg-white text-black' >or</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-black px-8'>
                            Login with user email?
                            <span className='text-blue-500 hover:underline'>
                                <Link to="#" onClick={() => setShowComponent('signin')}>Click here</Link>
                            </span>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-black px-8'>
                            Login with superAdmin email?
                            <span className='text-blue-500 hover:underline'>
                                <Link to="#" onClick={() => setShowComponent('signinSuperAdmin')}>Click here</Link>
                            </span>
                        </div>
                    </>
                )}
                {showComponent === 'otpInput' && (
                    <>
                        <h2 className='text-2xl font-bold text-black px-4' >Enter OTP</h2>
                        <p className="text-lg text-black font-medium px-4">We have sent a temporary passcode to you at {phoneNumber}</p>
                        <div className="w-full px-10 max-w-md text-black">
                            <OtpInput length={6} onOtpSubmit={onOtpSubmit} />
                        </div>
                        <p className='text-sm text-gray-500' >* Do not share this OTP with anyone as it is confidential.</p>
                    </>
                )}
                {showComponent === 'addTemple' && (
                    <Suspense fallback={<div className='flex items-center justify-center' ><Spinner color="purple" aria-label="Loading spinner example" /></div>}>
                        <SignupSuperAdmin setShowComponent={setShowComponent} />
                    </Suspense>
                )}
                {showComponent === 'createSuperAdmin' && (
                    <Suspense fallback={<div className='flex items-center justify-center' ><Spinner color="purple" aria-label="Loading spinner example" /></div>}>
                        <CreateSuperAdmin />
                    </Suspense>
                )}
                {showComponent === 'signin' && (
                    <Suspense fallback={<div className='flex items-center justify-center' ><Spinner color="purple" aria-label="Loading spinner example" /></div>}>
                        <SigninUser setShowComponent={setShowComponent} />
                    </Suspense>
                )}
                {showComponent === 'signinSuperAdmin' && (
                    <Suspense fallback={<div className='flex items-center justify-center' ><Spinner color="purple" aria-label="Loading spinner example" /></div>}>
                        <SigninSuperAdmin />
                    </Suspense>
                )}
            </div>
        </section>
    );
}
