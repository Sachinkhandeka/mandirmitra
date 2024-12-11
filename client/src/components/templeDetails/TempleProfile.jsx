import { Spinner } from "flowbite-react";
import { useState } from "react";
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import ShowAnuyayi from "./ShowAnuyayi";

export default function TempleProfileSection({ temple, isAnuyayi, loading, onFollowToggle }) {
    const [showAnuyayi, setShowAnuyayi] = useState(false);
    return (
        <div className="flex flex-col md:flex-row items-start gap-6 p-6">
            {/* Temple Image */}
            <div className="flex-shrink-0 w-full md:w-1/3">
                <img
                    src={temple.image}
                    alt={temple.name}
                    className="w-full h-auto max-h-[300px] object-fill rounded-lg"
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
                    <span className="font-semibold" onClick={()=> setShowAnuyayi(true)}>{temple.anuyayi.length} Anuyayi</span>
                </div>

                {/* Follow/Unfollow Button */}
                <button
                    className="px-6 py-2 my-3 md:max-w-40 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2"
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
        </div>
    );
}
