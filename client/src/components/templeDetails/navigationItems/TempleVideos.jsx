import { useState } from "react";
import EmptyState from "../../EmptyState";

export default function TempleVideos({ videos }) {
    const [expandedTitleIndex, setExpandedTitleIndex] = useState(null); 
    const [expandedDescIndex, setExpandedDescIndex] = useState(null);

    const MAX_TITLE_LENGTH = 30;
    const MAX_DESC_LENGTH = 100; 

    const toggleExpandTitle = (index) => {
        setExpandedTitleIndex(expandedTitleIndex === index ? null : index);
    };

    const toggleExpandDesc = (index) => {
        setExpandedDescIndex(expandedDescIndex === index ? null : index);
    };

    return (
        <section className="py-6 px-1 bg-gray-100 dark:bg-gray-900 min-h-screen">
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
