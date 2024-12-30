import { useState, useEffect } from "react";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import moment from "moment";
import { HiClock } from "react-icons/hi";
import { Badge } from "flowbite-react";
import { useSelector } from "react-redux";

export default function ViewOnlyStoryModal({ stories, setStoryModal }) {
    const { currUser } = useSelector((state) => state.user);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewsCount, setViewsCount] = useState(currentStory?.viewedBy.length || 0);
    const currentStory = stories[currentIndex];
    const viewedSet = new Set(); // Track viewed stories in the session

    const handleNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleViewedBy = async () => {
        if (!currentStory || !currUser || viewedSet.has(currentStory._id)) return;

        viewedSet.add(currentStory._id); // Mark as viewed in this session

        try {
            const response = await fetch(`/api/story/${currentStory._id}/view/${currUser._id}`, {
                method: "POST",
                headers: { "content-type": "application/json" },
            });

            if (!response.ok) {
                console.error("Failed to record view:", await response.json());
            }
            setViewsCount(data.viewsCount);
        } catch (error) {
            console.error("Error recording view:", error.message);
        }
    };

    useEffect(() => {
        if (currentStory && currUser && currentIndex) {
            handleViewedBy();
        }
    }, [currentIndex, currentStory, currUser]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
            <div
                className={`px-6 bg-gradient-to-r h-full ${
                    currentStory.isHighlighted ? "from-yellow-300 to-orange-400" : "from-gray-100 to-gray-200"
                } relative max-w-3xl h-screen w-full text-center flex flex-col items-center justify-center`}
            >
                <button
                    className="absolute top-2 right-4 bg-gray-200 hover:bg-gray-300 shadow-lg px-2 rounded-md text-black font-bold text-2xl"
                    onClick={() => setStoryModal(false)}
                >
                    ✕
                </button>
                <div className="text-4xl md:text-6xl font-serif text-red-700 mt-4">
                    <FaQuoteLeft className="inline-block mr-2 mb-10" />
                    {currentStory?.content || "No Title"}
                    <FaQuoteRight className="inline-block ml-2 mt-8" />
                </div>
                {currentStory?.translation && (
                    <p className="mt-4 text-lg text-gray-800 italic">{currentStory.translation}</p>
                )}
                {currentStory.date && moment(currentStory.date).isValid() && (
                    <Badge color="indigo" icon={HiClock} className="absolute top-4 left-4">
                        {moment(currentStory.date).fromNow()}
                    </Badge>
                )}
                <div className="mt-4 flex justify-center gap-6 text-sm text-gray-600">
                    {currentStory?.viewedBy !== undefined && (
                        <span className="flex items-center gap-1">
                            <IoEyeOutline className="text-lg" size={20} />
                            {viewsCount} Views
                        </span>
                    )}
                </div>
                <button
                    className={`px-4 py-2 absolute left-4 bottom-4 bg-gray-200 text-gray-800 rounded-lg ${
                        currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
                    }`}
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                >
                    Previous
                </button>
                <button
                    className={`px-4 py-2 absolute right-4 bottom-4 bg-orange-500 text-white rounded-lg ${
                        currentIndex === stories.length - 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-orange-600"
                    }`}
                    onClick={handleNext}
                    disabled={currentIndex === stories.length - 1}
                >
                    Next
                </button>
                { stories.length > 0 && (
                    <span className="absolute bottom-6 left-1/2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {currentIndex + 1}/{stories.length}
                    </span>
                )}
            </div>
        </div>
    );
}
