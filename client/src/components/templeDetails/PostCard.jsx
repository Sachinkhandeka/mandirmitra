import { Avatar } from "flowbite-react";
import { FiMessageSquare } from "react-icons/fi";
import { FaRegShareSquare } from "react-icons/fa";
import moment from "moment";
import PostImageCarousel from "../PostImageCarousel";
import LikeButton from "./LikeButton";
import CommentModal from "../CommentModal";
import { useState } from "react";

export default function PostCard({ post, setAlert }) {
    const [commentsModal, setCommentsModal] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const MAX_CONTENT_LENGTH = 100;

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const truncatedContent = post.content.length > MAX_CONTENT_LENGTH
        ? `${post.content.slice(0, MAX_CONTENT_LENGTH)}...`
        : post.content;
    const handleShare = async () => {
        if (navigator.share) {
            try {
                const postURL = window.location.href;
                
                await navigator.share({
                    title: post.title,
                    text: truncatedContent,
                    url: postURL, 
                });
                setAlert({ type: "success", message: "Post shared successfully!" });
            } catch (error) {
                setAlert({ type: "error", message: "Failed to share the post!" });
            }
        } else {
            setAlert({
                type: "error",
                message: "Your browser does not support the share functionality.",
            });
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden relative">
            {/* Post content */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between gap-3">
                    <div  className=" flex items-center gap-2" >
                        <Avatar
                            img={post.temple.image}
                            rounded
                            size="md"
                            alt="Temple Image"
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {post.temple.name || "Unknown Temple"}
                        </span>
                        { post.createdAt && moment(post.createdAt).isValid() && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                <span className="mr-1">•</span>
                                <span>{ moment(post.createdAt).fromNow() }</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {/* Image Carousel */}
            {post.images && post.images.length > 0 && (
                <PostImageCarousel images={post.images} postType={post.postType} />
            )}

            {/* Post Details */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {post.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {expanded ? post.content : truncatedContent}
                    {post.content.length > MAX_CONTENT_LENGTH && (
                        <button
                            onClick={toggleExpand}
                            className="ml-2 text-blue-700 dark:text-yellow-300 hover:underline text-xs"
                        >
                            {expanded ? "Show less" : "Show more"}
                        </button>
                    )}
                </p>
            </div>

            {/* Post Footer */}
            <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                    {/* Likes */}
                    <LikeButton post={post} setAlert={setAlert} />

                    {/* Comments */}
                    <button
                        className="flex items-center gap-1 text-gray-500 dark:text-gray-400"
                        onClick={() => setCommentsModal(true)}
                    >
                        <FiMessageSquare className="text-lg" />
                        <span className="text-sm">{post.comments.length}</span>
                    </button>
                </div>
                {/* Share */}
                <div
                    onClick={handleShare}
                    className="flex items-center justify-center cursor-pointer gap-1 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <FaRegShareSquare className="text-lg" />
                </div>
            </div>
            {commentsModal && (
                <CommentModal
                    post={post}
                    isOpen={commentsModal}
                    onClose={() => setCommentsModal(false)}
                />
            )}
        </div>
    );
}