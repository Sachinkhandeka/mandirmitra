import { Avatar, Dropdown, Tooltip, Spinner } from "flowbite-react";
import { useRef, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { GiShintoShrine } from "react-icons/gi";
import { FaCloudMoon, FaCloudSun, FaUserPlus } from "react-icons/fa";
import { GoPencil, GoSignOut } from "react-icons/go";
import { MdOutlineCancel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/theme/themeSlice";
import SmartSearch from "./SmartSearch";
import Alert from "../Alert";
import brand from "../../assets/brand.jpg";
import { Link, useNavigate } from "react-router-dom";
import { refreshToken, uploadImages } from "../../utilityFunx";
import { signinSuccess, signoutSuccess } from "../../redux/user/userSlice";

export default function TempleHeader() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { theme } = useSelector(state => state.theme);
    const { currUser } = useSelector(state => state.user);
    const [smartSearchBar, setSmartSearchBar] = useState(false);
    const [selectedImg, setSelectedImg] = useState("");
    const [uploadProgress, setUploadProgress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type : "", message : "" });
    const inputRef = useRef(null);

    const handleImageUpload = async () => {
        inputRef.current.click(); // Trigger file input click
    };

    const handleImageChange = async (event) => {
        if(uploadProgress) return ;
        const file = event.target.files[0];
        if (file) {
            setLoading(true);
            setUploadProgress(0);
            setSelectedImg(URL.createObjectURL(file));

            try {
                await refreshToken(); // Refresh auth token

                const downloadURLs = await uploadImages(
                    file,
                    setUploadProgress,
                    setLoading,
                    setAlert
                );

                const response = await fetch(`/api/devotee/${currUser._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ photoURL: downloadURLs[0] })
                });

                const data = await response.json();
                if (!response.ok) {
                    setSelectedImg(downloadURLs[0]);
                    console.error("Error updating profile:", data.message);
                }
                dispatch(signinSuccess(data.currUser));
                setUploadProgress(null);
            } catch (error) {
                console.error("Upload failed:", error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSignOut = async()=> {
        try {
            const response = await fetch("/api/devotee/signout", { method : "POST"});
            const data = await response.json();

            if(!response.ok) {
                return setAlert({ type : "error", message : data.message });
            }else {
                dispatch(signoutSuccess());
                navigate("/");
            }
        }catch(error) {
            setAlert({ type : "error", message : error.message });
        }
    }
    return (
        <div className="sticky top-0 z-20">
            <section className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-md rounded-t-none shadow-md flex items-center justify-between">
                <Link to={"/"} >
                    <Avatar img={brand} alt="company_logo" />
                </Link>
                <div className="flex gap-4 flex-row items-center">
                    <span className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer" onClick={() => setSmartSearchBar(!smartSearchBar)}>
                        { smartSearchBar ? <MdOutlineCancel size={28} /> :  <IoMdSearch size={28} aria-label="search-temples" /> }
                    </span>
                    { !currUser && !currUser.displayName &&  (
                        <span className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
                            <Tooltip content="Register Mandir">
                                <Link to={"/login"} >
                                    <GiShintoShrine size={28} aria-label="register temple" />
                                </Link>
                            </Tooltip>
                        </span>
                    ) }
                    <span className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer" onClick={() => dispatch(toggleTheme())}>
                        <Tooltip content="Toggle Theme">
                            {theme === "light" ? <FaCloudMoon size={28} /> : <FaCloudSun size={28} />}
                        </Tooltip>
                    </span>
                    <span className="cursor-pointer">
                        { currUser && currUser.displayName ? (
                            <Dropdown
                                label={<Avatar img={selectedImg || currUser.photoURL ? currUser.photoURL : ''} alt="Profile_img" placeholderInitials={currUser.displayName[0]} rounded />}
                                arrowIcon={false}
                                inline
                            >
                                <div className="fixed top-4 right-4 z-50 w-[70%] max-w-sm" >
                                    {alert && alert.message && (
                                        <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                                    )}
                                </div>
                                <div className="flex items-center justify-center flex-col gap-4 py-2 px-14" >
                                    <p className="text-xs text-black dark:text-white" >{ currUser.email }</p>
                                    <div className="relative rounded-full" >
                                        <Avatar img={currUser.photoURL ? currUser.photoURL : ''} placeholderInitials={currUser.displayName[0]} alt="Profile_img" rounded size={"lg"} />
                                        <input type="file" name="photoURL" id="photoURL" ref={inputRef} className="hidden" onChange={handleImageChange} />
                                        <div 
                                            className={`absolute bottom-[-4px] right-0 p-2 rounded-full 
                                            bg-white text-black hover:border hover:border-blue-500 
                                            hover:text-blue-500
                                            ${ uploadProgress ? 'rounded-full border-2 border-gray-200 border-t-blue-900 animate-spin' : '' }`}
                                            onClick={handleImageUpload} 
                                        >
                                            { uploadProgress ? '' :  <GoPencil /> }
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-light" >Radhe Radhe, { currUser.displayName }!</h3>
                                    <Link 
                                        to={"/profile"} 
                                        className={`border border-black rounded-full py-1 px-4 bg-white 
                                        hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 
                                        text-black dark:text-white dark:border-white`} >
                                            Manage your Account
                                    </Link>
                                </div>
                                <span className="fixed top-2 right-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 hover:rounded-full" onClick={handleSignOut} >
                                    <GoSignOut />
                                </span>
                            </Dropdown>
                        ) : (
                            <Link to={"/devotees"} className="p-2 rounded-md hover:bg-blue-200 dark:hover:bg-gray-600 font-medium flex items-center gap-3">
                                <FaUserPlus size={28} aria-label="login-signup" />
                                <span className="hidden md:block text-xs" aria-label="login-signup" >Login / Signup</span>
                            </Link>
                        ) }
                    </span>
                </div>
            </section>

            {/* Conditionally Render SmartSearch Below Header */}
            {smartSearchBar && (
                <div className="absolute w-full left-0 bg-white dark:bg-gray-700 text-center z-50">
                    <SmartSearch setSmartSearchBar={setSmartSearchBar} />
                </div>
            )}
        </div>
    );
}
