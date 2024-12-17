import { useEffect, useState } from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshDevoteeAccessToken } from "../../utilityFunx";
import { useSelector } from "react-redux";

export default function EntityLikeButton({ templeId, entityType, entityId, setAlert, initialLikes = [] }) {
    const { currUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes.length || 0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currUser && initialLikes && initialLikes.length > 0) {
            setLiked(initialLikes.includes(currUser._id));
        }
    }, [initialLikes, currUser]);

    const handleLikeDislike = async () => {
        setAlert({ type: "", message: "" });
        setLoading(true);
        try {
            if (!currUser) {
                setLoading(false);
                return setAlert({ type: "info", message: `Please Signup/Login to like ${entityType}` });
            }

            const data = await fetchWithAuth(
                `/api/temple/${templeId}/${entityType}/${entityId}/like`,
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                },
                refreshDevoteeAccessToken,
                "Devotee",
                setLoading,
                setAlert,
                navigate
            );

            if (data) {
                setLiked(data.entity.likes.includes(currUser._id));
                setLikes(data.entity.likes.length);
                setAlert({ type: "success", message: data.message });
            }
        } catch (error) {
            setAlert({ type: "error", message: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`relative flex items-center gap-1 text-gray-500 dark:text-gray-400 ${
                liked ? "text-red-500 dark:text-red-400" : ""
            }`}
            onClick={handleLikeDislike}
            disabled={loading} // Prevent multiple clicks while loading
        >
            {/* Heart Icon with Animation */}
            <span
                className={`p-2 rounded-full ${
                    liked ? "bg-red-100 dark:bg-red-900" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } transition-all duration-300`}
            >
                {liked ? (
                    <IoMdHeart
                        className="text-lg transition-transform duration-300 ease-out transform scale-125"
                        style={{ animation: "pop 0.3s ease-out" }}
                    />
                ) : (
                    <IoMdHeartEmpty className="text-lg transition-transform duration-300 ease-in-out" />
                )}
            </span>

            {/* Like Count */}
            <span
                className={`text-sm transition-transform duration-300 ${
                    liked ? "text-red-500 dark:text-red-400 font-semibold" : ""
                }`}
            >
                {likes}
            </span>

            {/* Glow Effect */}
            {liked && (
                <div
                    className="absolute inset-0 rounded-full bg-red-200 dark:bg-red-700 opacity-50 animate-ping"
                    style={{
                        zIndex: -1,
                        top: "0.1rem",
                        left: "0.1rem",
                        height: "2.6rem",
                        width: "2.6rem",
                    }}
                />
            )}
        </button>
    );
}
