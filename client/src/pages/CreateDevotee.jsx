import { Button, Spinner } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { signinStart, signinSuccess, signinFailure } from "../redux/user/userSlice";
import Alert from "../components/Alert";

// Temporary password generator
const generateTempPass = () => Math.random().toString(36).slice(-8);

export default function CreateDevotee() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ alert, setAlert ] = useState({ type : "", message : "" });
    const { loading } = useSelector(state => state.user);
    const [devotee, setDevotee] = useState({
        displayName: "",
        email: "",
        password: "",
        photoURL: "",
        phoneNumber: localStorage.getItem("signupPhoneNumber") || "",
    });
    const auth = getAuth(app);

    const handleOnChange = (e) => {
        const { id, value } = e.target;
        setDevotee({
            ...devotee,
            [id]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(signinStart());
        try {
            const response = await fetch('/api/devotee/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(devotee),
            });
            const data = await response.json();

            if (!response.ok) {
                dispatch(signinFailure(data.message));
                return setAlert({ type : "error", message : data.message });
            }
            dispatch(signinSuccess(data.currUser));
            navigate("/");
        } catch (error) {
            dispatch(signinFailure(error.message));
            setAlert({ type : "error", message : error.message });
        }
    };

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        dispatch(signinStart());

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const updatedDevotee = {
                displayName: user.displayName,
                email: user.email,
                password: generateTempPass(),
                photoURL: user.photoURL,
                phoneNumber: localStorage.getItem("signupPhoneNumber") || "",
            };
            setDevotee(updatedDevotee);

            const response = await fetch('/api/devotee/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedDevotee),
            });
            const data = await response.json();

            if (!response.ok) {
                return dispatch(signinFailure(data.message));
            }
            dispatch(signinSuccess(data.currUser));
            navigate("/");
        } catch (error) {
            dispatch(signinFailure(error.message));
        }
    };

    return (
        <section className="relative flex flex-col gap-4 w-full max-w-md py-6 bg-white rounded-lg md:border md:border-blue-500 p-10">
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                )}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="displayName" className="text-black">Your Name</label>
                    <input
                        type="text"
                        name="displayName"
                        id="displayName"
                        placeholder="*your name"
                        onChange={handleOnChange}
                        value={devotee.displayName}
                        className="rounded-lg bg-white text-black p-2 border"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-black">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="*youremail@gmail.com"
                        onChange={handleOnChange}
                        value={devotee.email}
                        className="rounded-lg bg-white text-black p-2 border"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-black">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="*******"
                        onChange={handleOnChange}
                        value={devotee.password}
                        className="rounded-lg bg-white text-black p-2 border"
                    />
                </div>
                <Button
                    gradientDuoTone="purpleToBlue"
                    className="w-full my-2"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? <Spinner color="purple" aria-label="loading indicator" /> : 'Create'}
                </Button>
            </form>
            <Button
                type="button"
                gradientDuoTone="pinkToOrange"
                className="w-full my-8 text-sm"
                onClick={handleGoogleClick}
                disabled={loading}
            >
                {loading ? "" : <AiFillGoogleCircle className="w-6 h-6 mr-3" />}
                {loading ? <Spinner color="warning" aria-label="loading indicator" /> : 'Continue with Google'}
            </Button>
        </section>
    );
}
