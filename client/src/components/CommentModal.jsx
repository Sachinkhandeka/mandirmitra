import { useState } from "react";
import { Modal, Button, Textarea, Spinner, Avatar } from "flowbite-react";
import { FiSend } from "react-icons/fi";
import { useSelector } from "react-redux";
import { fetchWithAuth, refreshDevoteeAccessToken } from "../utilityFunx";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";

export default function CommentModal({ post, isOpen, onClose }) {
    const { currUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [newComment, setNewComment] = useState("");
    const [addingComment, setAddingComment] = useState(false);
    const [alert, setAlert] = useState({ type : "", message : "" });

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        setAddingComment(true);
        setAlert({ type: "", message: "" });

        if(!currUser) {
            setAddingComment(false);
            return setAlert({ type : "info", message : "Please Signup/Login to comment on posts" });
        }
        try {
            const data = await fetchWithAuth(
                `/api/post/${post._id}/comment/${currUser._id}`,
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ comment: newComment }),
                },
                refreshDevoteeAccessToken,
                "Devotee",
                setAddingComment,
                setAlert,
                navigate
            );

            if (data) {
                // Update post comments with the latest comments from the server
                post.comments = data.post.comments || [];
                setNewComment(""); // Clear the input field
                setAlert({ type: "success", message: "Comment added successfully!" });
            }
        } catch (error) {
            setAlert({ type: "error", message: error.message });
        } finally {
            setAddingComment(false);
        }
    };

    return (
        <Modal show={isOpen} size="lg" onClose={onClose}>
            <Modal.Header>Comments</Modal.Header>
            <Modal.Body>
                {/* alert */}
                <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                    {alert && alert.message && (
                        <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                    )}
                </div>
                {/* Comments List */}
                {post.comments.length > 0 ? (
                    <div>
                        {post.comments.map((comment) => (
                            <div
                                key={comment._id}
                                className="p-3 border-b rounded-lg mb-2"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Avatar
                                        rounded
                                        placeholderInitials={comment.user?.displayName[0] || ""}
                                        img={comment.user?.photoURL}
                                        alt={comment.user?.displayName || "Anonymous"}
                                        size="sm"
                                    />
                                    <div className="flex flex-col" >
                                        <span className="text-sm font-semibold italic text-gray-800 dark:text-white">
                                            {comment.user?.displayName || "Anonymous"}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(comment.createdAt).toLocaleDateString("en-IN",{ day : "numeric", month : "short", year : "numeric"})}
                                            <span className="ml-2">•</span>
                                            {new Date(comment.createdAt).toLocaleTimeString("en-IN", { hour : "numeric", minute : "2-digit" })}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm">
                                    {comment.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
                        No comments yet. Be the first to comment!
                    </p>
                )}
            </Modal.Body>
            <Modal.Footer>
                {/* Input Field for Adding Comments */}
                <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={`Add a comment on "${post.title}"`}
                    rows={2}
                    className="flex-grow"
                />
                <Button
                    onClick={handleAddComment}
                    disabled={addingComment || !newComment.trim()}
                    gradientMonochrome="blue"
                    className="flex items-center gap-2 p-2 hover:bg-gray-100"
                >
                    {addingComment ? (
                        <Spinner size="sm" light />
                    ) : (
                        <FiSend size={18} />
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
