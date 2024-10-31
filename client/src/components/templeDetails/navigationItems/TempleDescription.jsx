import EmptyState from "../../EmptyState";

export default function TempleDescription({ description, images }) {
    return (
        <div className="mt-4 p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            {description ? (
                <>
                    {/* Temple Description */}
                    <p className="text-xl leading-relaxed text-gray-800 dark:text-gray-300">
                        {description}
                    </p>

                    {/* Images Section */}
                    <div className="my-8">
                        {images && images.length > 0 ? (
                            <>
                                <h3 className="text-2xl font-semibold my-4 text-gray-900 dark:text-white">
                                    Related Images
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {images.map((url, indx) => (
                                        <div
                                            key={indx}
                                            className="relative overflow-hidden group"
                                            style={{
                                                gridRowEnd: `span ${Math.floor(Math.random() * 2) + 2}`, // Dynamic grid row span effect
                                            }}
                                        >
                                            <img
                                                src={url}
                                                alt={`temple_history_image_${indx}`}
                                                className="h-full w-full object-cover rounded-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105 shadow-lg group-hover:shadow-2xl"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <span className="text-white text-lg font-bold">
                                                    Temple History
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <EmptyState message={"No related images available!"} />
                        )}
                    </div>
                </>
            ) : (
                <EmptyState message={"Description not available yet!"} />
            )}
        </div>
    );
}
