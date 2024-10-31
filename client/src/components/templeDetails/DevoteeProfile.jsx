import { useDispatch, useSelector } from "react-redux";
import { signinSuccess } from "../../redux/user/userSlice";
import FooterComp from "../FooterComp";
import TempleHeader from "./TempleHeader";
import Alert from "../Alert";
import { Avatar, TextInput, Button } from "flowbite-react";
import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdPerson, MdEmail, MdPhone, MdLock } from "react-icons/md";

export default function DevoteeProfile() {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ type: "", message: "" });
        try {
            const response = await fetch(`/api/devotee/${currUser._id}`, {
                method: "PUT",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(updatedDevotee),
            });
            const data = await response.json();

            if (!response.ok) {
                setAlert({ type: "error", message: data.message });
                return setLoading(false);
            }
            dispatch(signinSuccess(data.currUser));
            setAlert({ type: "success", message: "Profile updated successfully!" });
            setLoading(false);
            setEdit(false);
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
            const response = await fetch(`/api/devotee/${currUser._id}/password`, {
                method: "PUT",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(passwordUpdate),
            });
            const data = await response.json();

            if (!response.ok) {
                setAlert({ type: "error", message: data.message });
                return setLoading(false);
            }
            setAlert({ type: "success", message: "Password updated successfully!" });
            setLoading(false);
            setPasswordUpdate({ oldPassword: "", newPassword: "" });
        } catch (error) {
            setAlert({ type: "error", message: error.message });
            setLoading(false);
        }
    };

    return (
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
            <FooterComp />
        </section>
    );
}
