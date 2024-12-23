import { Carousel } from "flowbite-react";
import EmptyState from "../../EmptyState";
import { FaRegShareSquare } from "react-icons/fa";
import EntityLikeButton from "../EntityLikeButton";
import Alert from "../../Alert";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

export default function TempleFestivals({ festivals, templeId, templeName }) {
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [expandedIndex, setExpandedIndex] = useState(null); // Track expanded festival description

    const toggleExpanded = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const handleShare = (fest) => {
        // Truncate the description for sharing
        const truncatedDescription =
            fest.festivalImportance.length > 150
                ? fest.festivalImportance.substring(0, 150) + "..."
                : fest.festivalImportance;

        // Get the current page URL
        const currentUrl = window.location.href;

        if (navigator.share) {
            // Use the Web Share API if available
            navigator
                .share({
                    title: fest.festivalName,
                    text: `${fest.festivalName}: ${truncatedDescription}`,
                    url: currentUrl,
                })
                .then(() => {
                    setAlert({ type: "success", message: "Festival shared successfully!" });
                })
                .catch((error) => {
                    setAlert({ type: "error", message: `Failed to share: ${error.message}` });
                });
        } else {
            // Fallback: Copy the URL to the clipboard
            const shareText = `${fest.festivalName}: ${truncatedDescription}\n\nCheck it out here: ${currentUrl}`;
            navigator.clipboard
                .writeText(shareText)
                .then(() => {
                    setAlert({ type: "success", message: "Shareable link copied to clipboard!" });
                })
                .catch((error) => {
                    setAlert({
                        type: "error",
                        message: `Failed to copy link: ${error.message}`,
                    });
                });
        }
    };

    return (
        <div className="w-full p-1 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Helmet for SEO */}
            <Helmet>
                <title>{templeName} - Festivals | MandirMitra</title>
                <meta
                    name="description"
                    content={`Discover the festivals celebrated at ${templeName}. Explore their importance, rituals, and celebrations.`}
                />
                <meta
                    name="keywords"
                    content={`temple festivals, ${templeName} celebrations, Hindu rituals`}
                />
                <meta
                    property="og:title"
                    content={`${templeName} - Festivals | MandirMitra`}
                />
                <meta
                    property="og:description"
                    content={`Discover the festivals celebrated at ${templeName}.`}
                />
                <meta property="og:url" content={window.location.href} />
            </Helmet>
            {/* Alert */}
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        autoDismiss
                        onClose={() => setAlert({ type: "", message: "" })}
                    />
                )}
            </div>

            {/* Festivals Section */}
            {festivals && festivals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {festivals.map((fest, indx) => (
                        <div
                            key={indx}
                            className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                        >
                            {/* Festival Header */}
                            <h3 className="px-6 py-3 text-lg font-semibold">
                                {fest.festivalName}
                            </h3>

                            {/* Image Carousel */}
                            <div className="relative h-56">
                                {fest.festivalImages && fest.festivalImages.length > 0 ? (
                                    <Carousel slide={false} className="rounded-lg overflow-hidden">
                                        {fest.festivalImages.map((url, indx) => (
                                            <img
                                                src={url}
                                                alt={`temple_festival_image_${indx}`}
                                                key={indx}
                                                className="w-full h-full object-cover"
                                            />
                                        ))}
                                    </Carousel>
                                ) : (
                                    <div className="h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500">
                                        No Images Available
                                    </div>
                                )}
                            </div>

                            {/* Festival Description */}
                            <div className="px-6 py-4">
                                <p
                                    className={`text-sm text-gray-700 dark:text-gray-300 ${
                                        expandedIndex === indx ? "" : "line-clamp-3"
                                    }`}
                                >
                                    {fest.festivalImportance}
                                </p>
                                {fest.festivalImportance.length > 150 && (
                                    <button
                                        onClick={() => toggleExpanded(indx)}
                                        className="text-indigo-500 hover:text-indigo-700 text-sm mt-2"
                                    >
                                        {expandedIndex === indx ? "Show Less" : "Show More"}
                                    </button>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-700">
                                {/* Like Button */}
                                <EntityLikeButton
                                    templeId={templeId}
                                    entityType={"festivals"}
                                    entityId={fest._id}
                                    setAlert={setAlert}
                                    initialLikes={fest.likes}
                                />

                                {/* Share Button */}
                                <button
                                    onClick={() => handleShare(fest)}
                                    className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500"
                                >
                                    <FaRegShareSquare className="text-xl" />
                                    <span className="text-sm">Share</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState message={"Festivals not available yet for this temple!"} />
            )}
        </div>
    );
}
