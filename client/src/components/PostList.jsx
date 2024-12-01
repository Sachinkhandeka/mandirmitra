import { useEffect, useState } from "react";
import { Spinner, Dropdown, Tooltip } from "flowbite-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaShareSquare, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import PostImageCarousel from "./PostImageCarousel";
import EditPost from "./edit/EditPost";
import DeletePost from "./delete/DeletePost";
import { FiHeart, FiMessageSquare } from "react-icons/fi";

export default function PostList({ templeId, setAlert, fetchPosts, setFetchPosts }) {
    const [posts, setPosts] = useState([]);
    const [postCount, setPostCount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [currentDelPost, setCurrentDelPost] = useState(null);

    const getAllPosts = async () => {
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
            setPostCount(data.count);
            setFetchPosts(false);
        } catch (error) {
            setAlert({ type: "error", message: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (templeId) {
            getAllPosts();
        }
    }, [templeId, fetchPosts]);

    const openEditPost = (post) => {
        setCurrentPost(post);
        setIsEditing(true);
    };

    const openDeletePost = (post) => {
        setCurrentDelPost(post);
        setIsDeleting(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center my-10">
                <Spinner color="blue" size="xl" aria-label="Loading posts" />
            </div>
        );
    }

    return (
        <section className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Temple Posts ({postCount || 0})</h2>

            <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2">
                {posts.map((post) => (
                    <div
                        key={post._id}
                        className="flex-shrink-0 snap-center relative bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg"
                    >
                        <PostImageCarousel images={post.images} postType={post.postType} />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white my-2">
                                {post.title}
                            </h3>
                            <p className="text-sm text-gray-600 max-w-md dark:text-gray-300 mb-3 line-clamp-3">
                                {post.content}
                            </p>
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center gap-4">
                                    {/* Likes */}
                                    <Tooltip content={`${post.likes.length} likes`}>
                                        <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                            <FiHeart className="text-lg" />
                                            <span className="text-sm">{post.likes.length}</span>
                                        </button>
                                    </Tooltip>

                                    {/* Comments */}
                                    <Tooltip content={`${post.comments.length} comments`}>
                                        <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                            <FiMessageSquare className="text-lg" />
                                            <span className="text-sm">{post.comments.length}</span>
                                        </button>
                                    </Tooltip>
                                </div>
                                <Dropdown
                                    label={<BsThreeDotsVertical className="text-lg text-gray-500 dark:text-gray-400" />}
                                    inline
                                    arrowIcon={false}
                                >
                                    <Dropdown.Item icon={FaEdit} onClick={() => openEditPost(post)}>
                                        Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        icon={MdDelete}
                                        onClick={() => openDeletePost(post)}
                                        className="text-red-500"
                                    >
                                        Delete
                                    </Dropdown.Item>
                                    <Dropdown.Item icon={FaShareSquare}>Share</Dropdown.Item>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isEditing && (
                <EditPost
                    post={currentPost}
                    onUpdate={getAllPosts}
                    setAlert={setAlert}
                    closeEdit={() => setIsEditing(false)}
                />
            )}

            {isDeleting && (
                <DeletePost
                    post={currentDelPost}
                    isOpen={isDeleting}
                    onClose={() => setIsDeleting(false)}
                    refreshPosts={getAllPosts} // Function to refresh the post list
                    alert={alert}
                    setAlert={setAlert}
                />
            )}
        </section>
    );
}
