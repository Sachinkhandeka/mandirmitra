import { Avatar, Spinner, Modal, Button } from "flowbite-react";
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";
import ShowAnuyayi from "./ShowAnuyayi";

const TempleDescription = React.lazy(()=> import("./navigationItems/TempleDescription"));
const TempleFestivals = React.lazy(()=> import("./navigationItems/TempleFestivals"));
const TempleVideos = React.lazy(()=> import("./navigationItems/TempleVideos"));
const TemplePhotos = React.lazy(()=> import("./navigationItems/TemplePhotos"));
const TempleGods = React.lazy(()=> import("./navigationItems/TempleGods"));
const TemplePujaris = React.lazy(()=> import("./navigationItems/TemplePujaris"));
const TempleManagement = React.lazy(()=> import("./navigationItems/TempleManagment"));

const navigationItems = ['About', 'Festivals', 'Videos', 'Photos', 'Gods', 'Pujaris', 'Managment'];

export default function TempleDetailsSection({ temple, setTemple }) {
    const navigate = useNavigate();
    const { currUser } = useSelector( state => state.user );
    const [ activeNavItem, setActiveNavItem ] = useState('About');
    const [ alert, setAlert ] = useState({ type : "", message : "" });
    const [ loading, setLoading ] = useState(false);
    const [ showAnuyayi, setShowAnuyayi ] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    const isAnuyayi = temple.anuyayi.some(anuyayi => anuyayi._id === currUser?._id);

    const handleAnuyayi = async ()=> {
        setAlert({ type : "", message : "" });
        setLoading(true);
        if(!currUser) {
           return navigate("/devotees");
        }
        try {
            const response = await fetch(`/api/temple/${temple._id}/anuyayi/${currUser._id}`,
                {
                    method : "POST",
                    headers : { "content-type" : "application/json" }
                }
            );
            const data = await response.json();
            if(!response.ok) {
                setLoading(false);
                navigate("/devotees");
                return setAlert({ type : "error", message : data.message });
            }
            setLoading(false);
            setTemple(data.temple);
            setAlert({ type : "success", message : data.message });
        }catch(error) {
            setLoading(false);
            setAlert({ type : "error", message: error.message });
        }
    }

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
            <meta property="og:title" content={`${temple.name} - Temple Details | MandirMitra`} />
            <meta property="og:description" content={`Learn about ${temple.name}, founded in ${temple.foundedYear}. Discover festivals, gods, priests, and more.`} />
            <meta property="og:image" content={temple.image || 'https://www.mandirmitra.co.in/images/temple-banner.jpg'} />
            <meta property="og:url" content={`https://www.mandirmitra.co.in/temple/${temple._id}`} />

            {/* Structured Data for SEO */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "HinduTemple",
                    "name": temple.name,
                    "alternateName": temple.alternateName || "",
                    "foundingDate": temple.foundedYear,
                    "location": {
                        "@type": "Place",
                        "name": temple.location
                    },
                    "description": temple.description,
                    "image": temple.image,
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.5",
                        "reviewCount": `${temple.anuyayi.length}`
                    },
                    "hasOfferCatalog": temple.festivals.map(festival => ({
                        "@type": "OfferCatalog",
                        "name": festival.festivalName,
                        "description": festival.festivalImportance,
                        "image": festival.festivalImages
                    })),
                    "employee": temple.pujaris.map(pujari => ({
                        "@type": "Person",
                        "name": pujari.name,
                        "jobTitle": pujari.designation,
                        "telephone": pujari.contactInfo,
                        "worksFor": {
                            "@type": "Organization",
                            "name": temple.name
                        }
                    }))
                })}
            </script>
        </Helmet>
        {/* Confirmation Modal for Unfollowing */}
        <Modal show={openConfirmModal} size="md" onClose={() => setOpenConfirmModal(false)} popup>
            <Modal.Header />
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to Anutyaag(unfollow) this temple?
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
        <section className="text-black dark:text-white min-h-screen mb-8" aria-labelledby="temple-details-title">
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                )}
            </div>
                <div className="flex gap-6 p-6">
                    <div>
                        <div className="flex gap-3" >
                            <Avatar img={temple.image} size={"lg"} rounded />
                            <div className="flex flex-col" >
                                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white my-2" id="temple-details-title">
                                    {temple.name}
                                </h2>
                                <h3 className="text-lg text-gray-600 dark:text-gray-300 my-2">
                                    {temple.alternateName}
                                </h3>
                            </div>
                        </div>
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
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm my-2">
                            <span className="mx-2">•</span>
                            <span onClick={()=> setShowAnuyayi(true)} className="cursor-pointer hover:underline" >Anuyayi {temple.anuyayi.length}</span>
                        </div>
                        <button
                            className="px-6 py-2 my-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2"
                            onClick={() => (isAnuyayi ? setOpenConfirmModal(true) : handleAnuyayi())}
                            disabled={loading}
                        >
                            {loading ? (
                                <Spinner color="failure"  size="sm" aria-label="Loading spinner" />
                            ) : isAnuyayi ? (
                                'Anutyaag'
                            ) : (
                                'Anu'
                            )}
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4 overflow-x-scroll scrollbar-hidden mx-3" role="tablist" aria-label="Navigation Items" >
                    { navigationItems.map( item => (
                        <h3 className={`flex items-center pl-3 cursor-pointer
                            hover:bg-indigo-100 hover:text-indigo-800 me-2 px-2.5 py-0.5 rounded-full hover:dark:bg-indigo-900 hover:dark:text-indigo-300 
                            ${activeNavItem === item ? 'bg-blue-100 text-blue-800 me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 border border-blue-400' 
                                : 'text-gray-600 dark:text-gray-400'} 
                            text-lg font-semibold my-2 px-3 whitespace-nowrap`} 
                            key={item} 
                            onClick={()=> setActiveNavItem(item)}
                            role="tab" 
                            aria-selected={activeNavItem === item}  
                            >
                                {item}
                        </h3>
                    ) ) }
                </div>
                <div className="p-3" >
                    { activeNavItem === "About" && ( <TempleDescription description={temple.description} images={temple.historyImages} /> ) }
                    { activeNavItem === "Festivals" && ( <TempleFestivals festivals={temple.festivals} /> ) }
                    { activeNavItem === "Videos" && ( <TempleVideos videos={temple.videos} /> ) }
                    { activeNavItem === "Photos" && ( <TemplePhotos photos={[...temple.historyImages, ...temple.festivals.flatMap(festival => festival.festivalImages)]} /> ) }
                    { activeNavItem === "Gods" && ( <TempleGods gods={temple.godsAndGoddesses} /> ) }
                    { activeNavItem === "Pujaris" && ( <TemplePujaris pujaris={temple.pujaris} /> ) }
                    { activeNavItem === "Managment" && ( <TempleManagement management={temple.management} /> ) }
                </div>
        </section>
        { showAnuyayi && ( <ShowAnuyayi anuyayiList={temple.anuyayi} showAnuyayi={showAnuyayi} setShowAnuyayi={setShowAnuyayi} /> ) }
        </>
    );
}
