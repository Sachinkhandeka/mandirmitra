import { useDispatch, useSelector } from "react-redux";
import { signinSuccess } from "../../redux/user/userSlice";
import { BsFacebook, BsInstagram, BsLinkedin, BsTwitterX  } from "react-icons/bs";
import TempleHeader from "./TempleHeader";
import Alert from "../Alert";
import { Avatar, TextInput, Button, Footer } from "flowbite-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdPerson, MdEmail, MdPhone, MdLock } from "react-icons/md";
import { fetchWithAuth, refreshDevoteeAccessToken } from "../../utilityFunx";
import { useNavigate } from "react-router-dom";

export default function DevoteeProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currUser } = useSelector(state => state.user);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [updatedDevotee, setUpdatedDevotee] = useState({
        displayName: currUser?.displayName || "",
        email: currUser?.email || "",
        phoneNumber: currUser?.phoneNumber || "",
    });
    const [passwordUpdate, setPasswordUpdate] = useState({
        oldPassword: "",
        newPassword: ""
    });

    const handleOnChange = (e) => {
        const { id, value } = e.target;
        setUpdatedDevotee({ ...updatedDevotee, [id]: value });
    };

    const handlePasswordChange = (e) => {
        const { id, value } = e.target;
        setPasswordUpdate({ ...passwordUpdate, [id]: value });
    };

    const handleSubmit = async (e, retry = false) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ type: "", message: "" });
        try {
            const data = await fetchWithAuth(
                `/api/devotee/${currUser._id}`,
                {
                    method: "PUT",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(updatedDevotee),
                },
                refreshDevoteeAccessToken,
                'Devotee',
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                dispatch(signinSuccess(data.currUser));
                setAlert({ type: "success", message: "Profile updated successfully!" });
                setLoading(false);
                setEdit(false);
            }
        } catch (error) {
            setAlert({ type: "error", message: error.message });
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ type: "", message: "" });
        try {

            const data = await fetchWithAuth(
                `/api/devotee/${currUser._id}/password`,
                {
                    method: "PUT",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(passwordUpdate),
                },
                refreshDevoteeAccessToken,
                "Devotee",
                setLoading,
                setAlert,
                navigate,
            );
            if(data) {
                setAlert({ type: "success", message: "Password updated successfully!" });
                setLoading(false);
                setPasswordUpdate({ oldPassword: "", newPassword: "" });
            }
        } catch (error) {
            setAlert({ type: "error", message: error.message });
            setLoading(false);
        }
    };

    return (
        <>
        <Helmet>
            {/* Helmet for SEO Meta Tags and Structured Data */}
            <title>{currUser.displayName} - Profile Overview</title>
            <meta 
                name="description"
                content="manage your profile details like displayname, email, phone number, password"
            />
            <meta
                name="keywords"
                content="manage profile, profile overview, profile settings, manage password, update profile, mandirmitra" 
            />
            <meta name="author" content="MandirMitra Team" />
            <meta property="og:title" content={`${currUser.displayName} - Profile Overview`} />
            <meta property="og:description" content="manage your profile details like displayname, email, phone number, password" />
            <meta property="og:url" content="https://www.mandirmitra.co.in/profile" />
            <meta property="og:type" content="website" />

            {/* Structured Data for Login and Registration */}
            <script type="application/ld+json" >
                { JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": currUser.displayName,
                    "description": "manage your profile details like displayname, email, phone number, password.",
                    "url": "https://www.mandirmitra.co.in/profile",
                    "potentialAction": [{
                        "@type": "UpdateAction",
                        "name": "manage your profile details, update your profile info",
                        "target": "https://www.mandirmitra.co.in/profile",
                        "result": {
                            "@type": "UpdateAction",
                            "name": "update your profile info"
                        }
                    }]
                }) }
            </script>
        </Helmet>
        <section className="min-h-screen text-black dark:text-white">
            <TempleHeader />
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                )}
            </div>
            {currUser && currUser.displayName ? (
                <section className="min-h-screen p-6 flex flex-col items-center gap-6">
                    <Avatar img={currUser.photoURL || ""} alt="Profile_img" rounded size="xl" />
                    <h2 className="text-2xl md:text-4xl font-bold mb-2">Har Har Mahadev, {currUser.displayName}!</h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full" >
                    <div className="w-full max-w-lg bg-white dark:bg-gray-800 border rounded-lg p-6 relative space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <MdPerson className="text-blue-500" /> Profile Information
                        </h3>
                        <FiEdit3
                            className="absolute top-2 right-6 text-blue-600  cursor-pointer"
                            size={24}
                            onClick={() => setEdit(!edit)}
                        />
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <MdPerson className="text-gray-500 dark:text-gray-400" />
                                <TextInput
                                    id="displayName"
                                    placeholder="Your Name"
                                    value={updatedDevotee.displayName}
                                    onChange={handleOnChange}
                                    disabled={!edit}
                                    label="Display Name"
                                    required
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <MdEmail className="text-gray-500 dark:text-gray-400" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    placeholder="Your Email"
                                    value={updatedDevotee.email}
                                    onChange={handleOnChange}
                                    disabled={!edit}
                                    label="Email"
                                    required
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <MdPhone className="text-gray-500 dark:text-gray-400" />
                                <TextInput
                                    id="phoneNumber"
                                    placeholder="Your Phone Number"
                                    value={updatedDevotee.phoneNumber}
                                    onChange={handleOnChange}
                                    disabled={!edit}
                                    label="Phone Number"
                                    required
                                    className="w-full"
                                />
                            </div>
                            {edit && (
                                <Button type="submit" gradientDuoTone="purpleToBlue" className="w-full mt-4">
                                    {loading ? (
                                        <AiOutlineLoading3Quarters className="animate-spin mx-auto" size={20} />
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            )}
                        </form>
                    </div>

                    {/* Password Update Card */}
                    <div className="w-full max-w-lg bg-white dark:bg-gray-800 border rounded-lg p-6 space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <MdLock className="text-red-500" /> Update Password
                        </h3>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <MdLock className="text-gray-500 dark:text-gray-400" />
                                <TextInput
                                    id="oldPassword"
                                    type="password"
                                    placeholder="Current Password"
                                    value={passwordUpdate.oldPassword}
                                    onChange={handlePasswordChange}
                                    label="Current Password"
                                    required
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <MdLock className="text-gray-500 dark:text-gray-400" />
                                <TextInput
                                    id="newPassword"
                                    type="password"
                                    placeholder="New Password"
                                    value={passwordUpdate.newPassword}
                                    onChange={handlePasswordChange}
                                    label="New Password"
                                    required
                                    className="w-full"
                                />
                            </div>
                            <Button type="submit" gradientDuoTone="pinkToOrange" className="w-full mt-4">
                                {loading ? (
                                    <AiOutlineLoading3Quarters className="animate-spin mx-auto" size={20} />
                                ) : (
                                    "Update Password"
                                )}
                            </Button>
                        </form>
                    </div>
                    </div>
                </section>
            ) : (
                <section className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="mb-4 text-7xl tracking-tight font-extrabold text-blue-600">404</h1>
                        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 dark:text-white">Something's missing.</p>
                        <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. Explore more on the homepage.</p>
                        <a href="/" className="text-blue-600 underline">Back to Homepage</a>
                    </div>
                </section>
            )}
            <Footer container>
                <Footer.Copyright href="/" by="mandirmitra™" year={2024} className="my-4" />
                <div className="mt-4 flex gap-2 space-x-6 sm:mt-0 sm:justify-center">
                    <Footer.Icon href=" https://www.facebook.com/profile.php?id=61561382858176&mibextid=ZbWKwL" icon={BsFacebook} target="_blank" rel="noopener noreferrer" />
                    <Footer.Icon href="https://www.instagram.com/mandirmitra/" icon={BsInstagram} target="_blank" rel="noopener noreferrer" />
                    <Footer.Icon href="https://www.linkedin.com/in/mandir-mitra/" icon={BsLinkedin} target="_blank" rel="noopener noreferrer" />
                    <Footer.Icon href="https://x.com/MandirMitra" icon={BsTwitterX} target="_blank" rel="noopener noreferrer" />
                </div>
            </Footer>
        </section>
        </>
    );
}
