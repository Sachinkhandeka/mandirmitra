import React, { useEffect, useState } from "react";
import EmptyState from "../../EmptyState";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { Helmet } from "react-helmet-async";

export default function TemplePhotos({ photos, templeName }) {
    const [likedPhotos, setLikedPhotos] = useState([]); // Tracks liked photos (by index)
    const [selectedPhoto, setSelectedPhoto] = useState(null); 
    const [gridSpans, setGridSpans] = useState([]); // Tracks grid spans for each photo

    useEffect(() => {
        const spans = photos.map(() => Math.floor(Math.random() * 2) + 2); // Random span between 2 and 3
        setGridSpans(spans);
    }, [photos]);

    // Toggle like-dislike functionality
    const toggleLike = (index) => {
        setLikedPhotos((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index) // If already liked, remove it (dislike)
                : [...prev, index] // Otherwise, add it (like)
        );
    };

    return (
        <section className="p-2 bg-gray-100 dark:bg-gray-900 min-h-screen">
             <Helmet>
                <title>{`${templeName} - Temple Photos | MandirMitra`}</title>
                <meta
                    name="description"
                    content="Explore the gallery of temple photos, capturing the essence and beauty of this divine space."
                />
                <meta
                    name="keywords"
                    content="temple photos, temple gallery, MandirMitra, temple images"
                />
                <meta
                    property="og:title"
                    content={`${templeName} - Temple Photos | MandirMitra`}
                />
                <meta
                    property="og:description"
                    content="Explore the gallery of temple photos, capturing the essence and beauty of this divine space."
                />
                <meta property="og:image" content={photos[0] || ""} />
                <meta property="og:url" content={window.location.href} />
            </Helmet>
            {photos && photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                    {photos.map((photo, index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden group"
                            style={{
                                gridRowEnd: `span ${gridSpans}`, // Dynamic grid row span
                            }}
                        >
                            {/* Image */}
                            <img
                                className="h-full w-full object-cover rounded-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105 shadow-lg group-hover:shadow-2xl cursor-pointer"
                                src={photo}
                                alt={`temple_photo_${index}`}
                                onClick={() => setSelectedPhoto(photo)} // Open Modal
                            />

                            {/* Like-Dislike Button */}
                            <button
                                className="absolute top-2 right-2 flex items-center gap-1"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent modal opening
                                    toggleLike(index); // Toggle like/dislike for the photo
                                }}
                            >
                                <span
                                    className={`p-2 rounded-full ${
                                        likedPhotos.includes(index)
                                            ? "bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                                    } transition-all duration-300`}
                                >
                                    {likedPhotos.includes(index) ? (
                                        <IoMdHeart className="text-lg transition-transform duration-300 ease-out transform scale-125" />
                                    ) : (
                                        <IoMdHeartEmpty className="text-lg transition-transform duration-300 ease-in-out" />
                                    )}
                                </span>

                                {/* Like Count */}
                                <span
                                    className={`text-sm transition-transform duration-300 ${
                                        likedPhotos.includes(index)
                                            ? "text-red-700 dark:text-red-900 font-semibold"
                                            : ""
                                    }`}
                                >
                                    {likedPhotos.includes(index) ? "Liked" : "Like"}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState message={"Photos not available yet for this temple!"} />
            )}

            {/* Fullscreen Modal */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
                    onClick={() => setSelectedPhoto(null)} // Close Modal
                >
                    <div className="relative max-w-full max-h-full">
                        <img
                            src={selectedPhoto}
                            alt="Fullscreen Temple"
                            className="max-w-full max-h-full object-fill"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
                        />
                        <button
                            className="absolute top-1 right-1 text-white text-lg bg-black bg-opacity-50 rounded-full"
                            onClick={() => setSelectedPhoto(null)}
                        >
                            <MdCancel size={25} />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
