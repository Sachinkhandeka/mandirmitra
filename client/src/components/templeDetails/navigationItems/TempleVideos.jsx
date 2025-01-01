import { useState } from "react";
import EmptyState from "../../EmptyState";
import { FaRegShareSquare } from "react-icons/fa";
import Alert from "../../Alert";
import EntityLikeButton from "../EntityLikeButton";
import { Helmet } from "react-helmet-async";

export default function TempleVideos({ videos, templeId, templeName }) {
    const [expandedTitleIndex, setExpandedTitleIndex] = useState(null); 
    const [expandedDescIndex, setExpandedDescIndex] = useState(null);
    const [alert, setAlert] = useState({ type : "", message : "" });

    const MAX_TITLE_LENGTH = 30;
    const MAX_DESC_LENGTH = 100; 

    const toggleExpandTitle = (index) => {
        setExpandedTitleIndex(expandedTitleIndex === index ? null : index);
    };

    const toggleExpandDesc = (index) => {
        setExpandedDescIndex(expandedDescIndex === index ? null : index);
    };

    const handleShare = (video)=> {
        const truncatedVideoDesc = 
            video.description.length > 150 ?
            video.description.subString(0,150) + "..." :
            video.description ; 
        const currentUrl = window.location.href ; 

        if(navigator.share) {
            navigator.share({
                title : video.title,
                description : truncatedVideoDesc,
                url : currentUrl,
                videoUrl : video.url
            })
            .then(()=> {
                setAlert({ type: "success", message: "Video shared successfully!" });
            })
            .catch((error)=> {
                setAlert({ type: "error", message: `Failed to share: ${error.message}` });
            })
        } else {
            const shareText = `${video.title}: ${truncatedVideoDesc}\n\nCheck it out here: ${currentUrl}`
            navigator.clipboard
            .writeText(shareText)
            .then(()=> {setAlert({ type: "success", message: "Shareable link copied to clipboard!" });})
            .catch((error)=>{setAlert({ type: "error", message: `Failed to copy link: ${error.message}` });})
        }
    }
    return (
        <section className="py-6 px-1 min-h-screen">
            <Helmet>
                <title>{`${templeName} - Temple Videos | MandirMitra`}</title>
                <meta
                    name="description"
                    content="Watch the latest videos from this temple, including spiritual discourses, rituals, and celebrations."
                />
                <meta
                    name="keywords"
                    content="temple videos, spiritual videos, temple celebrations, MandirMitra"
                />
                <meta
                    property="og:title"
                    content={`${templeName} - Temple Videos | MandirMitra`}
                />
                <meta
                    property="og:description"
                    content="Watch the latest videos from this temple, including spiritual discourses, rituals, and celebrations."
                />
                <meta property="og:url" content={window.location.href} />
            </Helmet>

            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert({ type: "", message: "" })} />
                )}
            </div>
            {videos && videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {videos.map((video, index) => {
                        const isTitleExpanded = expandedTitleIndex === index;
                        const isDescExpanded = expandedDescIndex === index;

                        const truncatedTitle = video.title.length > MAX_TITLE_LENGTH
                            ? `${video.title.slice(0, MAX_TITLE_LENGTH)}...`
                            : video.title;

                        const truncatedDescription = video.description.length > MAX_DESC_LENGTH
                            ? `${video.description.slice(0, MAX_DESC_LENGTH)}...`
                            : video.description;

                        return (
                            <div
                                key={index}
                                className="relative overflow-hidden group rounded-lg shadow-lg bg-white dark:bg-gray-800"
                            >
                                <iframe
                                    width="100%"
                                    height="215"
                                    src={video.url}
                                    title={`${video.title} ${index + 1}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="rounded-t-lg"
                                ></iframe>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                        {isTitleExpanded ? video.title : truncatedTitle}
                                        {video.title.length > MAX_TITLE_LENGTH && (
                                            <button
                                                onClick={() => toggleExpandTitle(index)}
                                                className="text-blue-700 dark:text-yellow-300 hover:underline font-extralight text-xs ml-2"
                                            >
                                                {isTitleExpanded ? "Show less" : "Show more"}
                                            </button>
                                        )}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        {isDescExpanded ? video.description : truncatedDescription}
                                        {video.description.length > MAX_DESC_LENGTH && (
                                            <button
                                                onClick={() => toggleExpandDesc(index)}
                                                className="text-blue-700 dark:text-yellow-300 hover:underline text-xs font-extralight ml-2"
                                            >
                                                {isDescExpanded ? "Show less" : "Show more"}
                                            </button>
                                        )}
                                    </p>
                                    <div className="flex justify-between items-center px-4 py-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-4">
                                            {/* Likes */}
                                            <EntityLikeButton 
                                                templeId={templeId} 
                                                entityType={"videos"} 
                                                entityId={video._id} 
                                                setAlert={setAlert}
                                                initialLikes={video.likes} 
                                            />
                                        </div>
                                        {/* Share */}
                                        <div
                                            onClick={()=> { handleShare(video) }}
                                            className="flex items-center justify-center cursor-pointer gap-1 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            <FaRegShareSquare className="text-lg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <EmptyState message={"Videos not available yet for this temple!"} />
            )}
        </section>
    );
}
