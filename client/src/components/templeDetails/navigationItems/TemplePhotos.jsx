import React, { useState } from "react";
import EmptyState from "../../EmptyState";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

export default function TemplePhotos({ photos }) {
    const [likedPhotos, setLikedPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    // Toggle like for a photo
    const toggleLike = (index) => {
        setLikedPhotos((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index) // Unlike
                : [...prev, index] // Like
        );
    };

    return (
        <section className="p-2 bg-gray-100 dark:bg-gray-900 min-h-screen">
            {photos && photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                    {photos.map((photo, index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden group"
                            style={{
                                gridRowEnd: `span ${Math.floor(Math.random() * 2) + 2}`, // Dynamic grid row span
                            }}
                        >
                            {/* Image */}
                            <img
                                className="h-full w-full object-cover rounded-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105 shadow-lg group-hover:shadow-2xl cursor-pointer"
                                src={photo}
                                alt={`temple_photo_${index}`}
                                onClick={() => setSelectedPhoto(photo)} // Open Modal
                            />

                            {/* Heart Icon */}
                            <div
                                className={`absolute top-2 right-2 text-2xl cursor-pointer 
                                    ${likedPhotos.includes(index) ? "text-red-700" : "text-gray-400"}`}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent modal opening
                                    toggleLike(index);
                                }}
                            >
                               {likedPhotos.includes(index) ? (
                                    <FaHeart
                                        className="text-orange-500 hover:text-orange-600 transition-transform duration-200 transform hover:scale-110"
                                    />
                                ) : (
                                    <FaRegHeart
                                        className="text-gray-300 hover:text-orange-500 transition-transform duration-200 transform hover:scale-110"
                                    />
                                )}
                            </div>
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
