import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { useState } from "react";
import { Select } from "flowbite-react";

export default function PostImageCarousel({ images, postType, isEditing, post, setPost }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState("right"); // To track slide direction

    const goToPrevious = () => {
        setDirection("left");
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
    };

    const goToNext = () => {
        setDirection("right");
        setCurrentIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
    };

    return (
        <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            {/* Image Container */}
            <div className="relative w-full h-96 flex items-center justify-center overflow-hidden">
                <div
                    className={`flex w-full h-full transition-transform duration-500 ease-in-out ${
                        direction === "right" ? "-translate-x-0" : "translate-x-full"
                    }`}
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Post image ${index + 1}`}
                            className="w-full h-full object-fill flex-shrink-0"
                        />
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
                <>
                    <button
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600"
                        onClick={goToPrevious}
                        aria-label="Previous image"
                    >
                        <HiOutlineChevronLeft size={20} />
                    </button>
                    <button
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600"
                        onClick={goToNext}
                        aria-label="Next image"
                    >
                        <HiOutlineChevronRight size={20} />
                    </button>
                </>
            )}

            {/* Post Type Badge */}
            {isEditing ? (
                <Select
                    name="postType"
                    id="postType"
                    value={postType}
                    onChange={(e) => setPost({ ...post, postType: e.target.value })}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600"
                >
                    <option value="general">General</option>
                    <option value="announcement">Announcement</option>
                </Select>
            ) : (
                <span
                    className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs ${
                        postType === "announcement"
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    }`}
                >
                    {postType.toUpperCase()}
                </span>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
                <span className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {currentIndex + 1}/{images.length}
                </span>
            )}
        </div>
    );
}
