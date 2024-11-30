import { useState, useEffect } from "react";
import { Avatar } from "flowbite-react";
import { FiMessageSquare } from "react-icons/fi";
import PostImageCarousel from "../../PostImageCarousel";
import EmptyState from "../../EmptyState";
import LikeButton from "../LikeButton";
import Alert from "../../Alert";

export default function TemplePosts({ templeId }) {
    const [posts, setPosts] = useState([]);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    const fetchAllPosts = async () => {
        setAlert({ type: "", message: "" });
        setLoading(true);
        try {
            const response = await fetch(`/api/post/${templeId}`);
            const data = await response.json();

            if (!response.ok) {
                setAlert({ type: "error", message: data.message });
                return;
            }

            setPosts(data.posts);
        } catch (error) {
            setAlert({ type: "error", message: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (templeId) fetchAllPosts();
    }, [templeId]);

    return (
        <section className="p-1 bg-gray-100 dark:bg-gray-900 min-h-screen">
            {/* Alert Message */}
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        autoDismiss
                        onClose={() => setAlert(null)}
                    />
                )}
            </div>
            { posts && posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} setAlert={setAlert} />
                    ))}
                </div>
            ) : (
                <EmptyState message={"Posts not available yet for this temple!"} />
            ) }
        </section>
    );
}

function PostCard({ post, setAlert }) {
    const [expanded, setExpanded] = useState(false);
    const MAX_CONTENT_LENGTH = 100;

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const truncatedContent = post.content.length > MAX_CONTENT_LENGTH
        ? `${post.content.slice(0, MAX_CONTENT_LENGTH)}...`
        : post.content;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden relative">
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
                <div className="flex items-center gap-3">
                    <Avatar
                        img={post.temple.image}
                        rounded
                        size="sm"
                        alt="Temple Image"
                        className="w-8 h-8"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        By: {post.temple.name || "Unknown Temple"}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    {/* Likes */}
                    <LikeButton post={post} setAlert={setAlert} />

                    {/* Comments */}
                    <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <FiMessageSquare className="text-lg" />
                        <span className="text-sm">{post.comments.length}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
