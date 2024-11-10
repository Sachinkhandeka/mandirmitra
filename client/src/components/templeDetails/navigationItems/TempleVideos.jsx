import EmptyState from "../../EmptyState";

export default function TempleVideos({ videos }) {
    return (
        <section className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            {videos && videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {videos.map((video, index) => (
                        <div 
                            key={index} 
                            className="relative overflow-hidden group rounded-lg shadow-lg"
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
                            <div className="p-4 bg-white dark:bg-gray-800">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                                    {video.title} {index + 1}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                                    {video.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState message={'Videos not available yet for this temple!'} />
            )}
        </section>
    );
}
