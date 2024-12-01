import { useEffect, useState } from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshDevoteeAccessToken } from "../../utilityFunx";
import { useSelector } from "react-redux";

export default function LikeButton({ post, setAlert }) {
    const { currUser } = useSelector( state => state.user );
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes.length);
    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        if(!currUser) {
            return setAlert({ type : "info", message : "Please Signup/Login to like posts" });
        }
        if( post.likes && post.likes.length > 0 ) {
            setLiked(post.likes.includes(currUser._id));
        }
    },[post, currUser]);

    const handleLikeDisLikePost = async ()=> {
        setAlert({ type : "", message : "" });
        setLoading(true);
        try {
            if(!currUser) {
                setLoading(false);
                return setAlert({ type : "info", message : "Please Signup/Login to like posts" });
            }
            const data = await fetchWithAuth(
                `/api/post/${post._id}/like/${currUser._id}`,
                {
                    method : "POST",
                    headers : { "content-type" : "application/json" }
                },
                refreshDevoteeAccessToken,
                "Devotee",
                setLoading,
                setAlert,
                navigate
            );

            if(data) {
                setLiked(data.post.likes.includes(currUser._id));
                setLikes(data.post.likes.length);
                setAlert({ type : "success", message : data.message });
            }
        } catch (error) {
            setAlert({ type : "error", message : error.message });
        } finally {
            setLoading(false);
        }
    }
    return (
        <button
            className={`relative flex items-center gap-1 text-gray-500 dark:text-gray-400 ${
                liked ? "text-red-500 dark:text-red-400" : ""
            }`}
            onClick={handleLikeDisLikePost}
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
