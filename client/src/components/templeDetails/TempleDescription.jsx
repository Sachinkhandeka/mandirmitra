import { Spinner, Modal, Button } from "flowbite-react";
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";
import ShowAnuyayi from "./ShowAnuyayi";
import { fetchWithAuth, refreshDevoteeAccessToken } from "../../utilityFunx";
import TempleNavigation from "./navigationItems/TempleNavigation";

export default function TempleDescription({ temple, setTemple }) {
    const navigate = useNavigate();
    const { currUser } = useSelector((state) => state.user);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [showAnuyayi, setShowAnuyayi] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    const isAnuyayi = temple.anuyayi.some((anuyayi) => anuyayi._id === currUser?._id);

    const handleAnuyayi = async () => {
        setAlert({ type: "", message: "" });
        setLoading(true);
        if (!currUser) {
            return navigate("/devotees");
        }
        try {
            const data = await fetchWithAuth(
                `/api/temple/${temple._id}/anuyayi/${currUser._id}`,
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                },
                refreshDevoteeAccessToken,
                "Devotee",
                setLoading,
                setAlert,
                navigate
            );

            if (data) {
                setLoading(false);
                setTemple(data.temple);
                setAlert({ type: "success", message: data.message });
            }
        } catch (error) {
            setLoading(false);
            setAlert({ type: "error", message: error.message });
        }
    };

    const handleUnfollowConfirm = () => {
        setOpenConfirmModal(false);
        handleAnuyayi();
    };

    return (
        <>
            {/* Helmet for SEO */}
            <Helmet>
                <title>{temple.name} - Temple Details | MandirMitra</title>
                <meta
                    name="description"
                    content={`Learn about ${temple.name}, founded in ${temple.foundedYear}. Discover festivals, gods worshiped, priests, and more.`}
                />
                <meta
                    name="keywords"
                    content={`temple, ${temple.name}, ${temple.location}, temple festivals, temple priests, temple management`}
                />
                <meta
                    property="og:title"
                    content={`${temple.name} - Temple Details | MandirMitra`}
                />
                <meta
                    property="og:description"
                    content={`Learn about ${temple.name}, founded in ${temple.foundedYear}. Discover festivals, gods, priests, and more.`}
                />
                <meta
                    property="og:image"
                    content={
                        temple.image ||
                        "https://www.mandirmitra.co.in/images/temple-banner.jpg"
                    }
                />
                <meta
                    property="og:url"
                    content={`https://www.mandirmitra.co.in/temple/${temple._id}`}
                />
            </Helmet>

            {/* Confirmation Modal for Unfollowing */}
            <Modal show={openConfirmModal} size="md" onClose={() => setOpenConfirmModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to Anutyaag (unfollow) this temple?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleUnfollowConfirm}>
                                Yes, Anutyaag
                            </Button>
                            <Button color="gray" onClick={() => setOpenConfirmModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <section
                className="text-black dark:text-white min-h-screen mb-8"
                aria-labelledby="temple-details-title"
            >
                <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                    {alert && alert.message && (
                        <Alert
                            type={alert.type}
                            message={alert.message}
                            autoDismiss
                            onClose={() => setAlert(null)}
                        />
                    )}
                </div>
                <div className="flex flex-col md:flex-row items-start gap-6 p-6">
                    <div className="flex-shrink-0 w-full md:w-1/3">
                        <img
                            src={temple.image}
                            alt={temple.name}
                            className="w-full h-auto max-h-[300px] object-fill rounded-lg"
                        />
                    </div>
                    <div className="flex flex-col w-full md:w-2/3">
                        <h2
                            className="text-3xl font-extrabold text-gray-900 dark:text-white my-2"
                            id="temple-details-title"
                        >
                            {temple.name}
                        </h2>
                        {temple.alternateName && (
                            <h3 className="text-lg text-gray-600 dark:text-gray-300 my-2">
                                {temple.alternateName}
                            </h3>
                        )}
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm my-2">
                            <FaMapMarkerAlt className="mr-2 text-xl" />
                            <span>{temple.location}</span>
                            {temple.foundedYear && (
                                <>
                                    <span className="mx-2">•</span>
                                    <FaRegCalendarAlt className="mr-2 text-xl" />
                                    <span>Founded in {temple.foundedYear}</span>
                                </>
                            )}
                        </div>
                        <div
                            className="flex items-center text-gray-600 dark:text-gray-400 text-sm my-2 cursor-pointer hover:underline"
                            onClick={() => setShowAnuyayi(true)}
                        >
                            <span className="mx-2">•</span>
                            <span className="font-semibold">{temple.anuyayi.length} Anuyayi</span>
                        </div>
                        <button
                            className="px-6 py-2 my-3 md:max-w-40 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2"
                            onClick={() => (isAnuyayi ? setOpenConfirmModal(true) : handleAnuyayi())}
                            disabled={loading}
                        >
                            {loading ? (
                                <Spinner color="failure" size="sm" aria-label="Loading spinner" />
                            ) : isAnuyayi ? (
                                "Anutyaag"
                            ) : (
                                "Anu"
                            )}
                        </button>
                    </div>
                </div>

                {/* Navigation and Content */}
                <TempleNavigation temple={temple} />
            </section>

            {showAnuyayi && (
                <ShowAnuyayi
                    anuyayiList={temple.anuyayi}
                    showAnuyayi={showAnuyayi}
                    setShowAnuyayi={setShowAnuyayi}
                />
            )}
        </>
    );
}
