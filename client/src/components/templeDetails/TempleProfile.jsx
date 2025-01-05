import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import ShowAnuyayi from "./ShowAnuyayi";
import { useSelector } from "react-redux";
import banner from "../../assets/banner.png";
import ViewOnlyStoryModal from "../story/ViewOnlyStoryModal";

export default function TempleProfileSection({ temple, isAnuyayi, loading, onFollowToggle, setAlert }) {
    const [showAnuyayi, setShowAnuyayi] = useState(false);
    const [stories, setStories] = useState([]);
    const [storyModal, setStoryModal] = useState(false);
    const { currUser } = useSelector((state) => state.user);

    // Check if the current user has viewed the stories
    const isStoriesViewed = stories?.some((story) =>
        story.viewedBy.some((viewer) => viewer._id === currUser?._id)
    );

    const getStories = async () => {
        setAlert({ type: "", message: "" });
        try {
            const response = await fetch(`/api/story/${temple._id}`, {
                method: "GET",
            });
            const data = await response.json();

            if (!response.ok) {
                setAlert({ type: "error", message: data.message });
            }
            if (data.stories) {
                setStories(data.stories);
            }
        } catch (error) {
            setAlert({ type: "error", message: error.message });
        }
    };

    useEffect(() => {
        // Reset stories if temple._id changes
        setStories([]);
        if (temple._id) {
            getStories();
        }
    }, [temple._id]);

    const handleStoryModal = () => {
        if (stories.length === 0) {
            return setAlert({ type: "warning", message: "Please login to start seeing stories of temples" });
        }
        if (!currUser || !currUser.displayName) {
            return setAlert({ type: "warning", message: "Please login to start seeing stories of temples" });
        }
        setStoryModal(true);
    };

    const borderClass = () => {
        if (stories.length > 0) {
            return isStoriesViewed ? "border-2 border-gray-400" : "border-2 border-orange-500";
        }
        return "border-none";
    };

    return (
        <>
            {/* background image */}
            <div
                className="relative bg-cover bg-center bg-no-repeat h-full md:h-52 rounded-lg flex items-center justify-center p-10 m-4"
                style={{ backgroundImage: `url(${banner})` }}
            >
                {/* temple image */}
                <div className="absolute top-1 left-1 z-10">
                    <img
                        src={temple.image}
                        alt="Temple Logo"
                        className="w-10 h-10 md:w-24 md:h-24 rounded-full border-2 border-white shadow-lg"
                    />
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg"></div>
                {/* Temple Name and Decorative Touch */}
                <div className="z-10 text-center flex items-center justify-center flex-col">
                    <h1 className="bg-white p-1 text-sm md:text-3xl lg:text-5xl font-bold text-transparent bg-clip-text drop-shadow-md">
                        {temple.name}
                    </h1>
                    {temple.alternateName && (
                        <p className="bg-white mt-2 text-xs md:text-md lg:text-xl text-transparent bg-clip-text italic">
                            "{temple.alternateName}"
                        </p>
                    )}
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-6 p-6">
                {/* Temple Image */}
                <div
                    className={`flex-shrink-0 w-full md:w-1/3 cursor-pointer rounded-lg p-1 ${borderClass()}`}
                >
                    <img
                        src={temple.image}
                        alt={temple.name}
                        className="cursor-pointer w-full h-auto max-h-[300px] object-fill rounded-lg"
                        onClick={handleStoryModal}
                    />
                </div>

                {/* Temple Info */}
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
                    >
                        <span className="mx-2">•</span>
                        <span className="font-semibold" onClick={() => setShowAnuyayi(true)}>
                            {temple.anuyayi.length} Anuyayi
                        </span>
                    </div>

                    {/* Follow/Unfollow Button */}
                    <button
                        className={`px-6 py-2 my-3 md:max-w-40 font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors
                            ${isAnuyayi ? "bg-gray-400 text-white hover:bg-gray-500" : "bg-orange-500 text-white hover:bg-orange-600"}`}
                        onClick={onFollowToggle}
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
                {showAnuyayi && (
                    <ShowAnuyayi
                        anuyayiList={temple.anuyayi}
                        showAnuyayi={showAnuyayi}
                        setShowAnuyayi={setShowAnuyayi}
                    />
                )}
                {storyModal && (
                    <ViewOnlyStoryModal
                        stories={stories}
                        setStoryModal={setStoryModal}
                    />
                )}
            </div>
        </>
    );
}
