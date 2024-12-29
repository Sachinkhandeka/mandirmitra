import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";
import { fetchWithAuth, refreshDevoteeAccessToken } from "../../utilityFunx";
import TempleNavigation from "./navigationItems/TempleNavigation";
import TempleProfile from "./TempleProfile";

export default function TempleDescription({ temple, setTemple }) {
    const navigate = useNavigate();
    const { currUser } = useSelector((state) => state.user);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);
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
                <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                    {alert && alert.message && (
                        <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                    )}
                </div>
                {/* Profile Section */}
                <TempleProfile
                    temple={temple}
                    isAnuyayi={isAnuyayi}
                    loading={loading}
                    onFollowToggle={() =>
                        isAnuyayi ? setOpenConfirmModal(true) : handleAnuyayi()
                    }
                    setAlert={setAlert}
                />

                {/* Navigation and Content */}
                <TempleNavigation temple={temple} />
            </section>

        </>
    );
}
