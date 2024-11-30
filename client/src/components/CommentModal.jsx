import { useState } from "react";
import { Modal, Button, Textarea, Spinner, Avatar } from "flowbite-react";
import { FiSend } from "react-icons/fi";
import { useSelector } from "react-redux";
import { fetchWithAuth, refreshDevoteeAccessToken } from "../utilityFunx";
import { useNavigate } from "react-router-dom";

export default function CommentModal({ post, isOpen, onClose, setAlert }) {
    const { currUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [newComment, setNewComment] = useState("");
    const [addingComment, setAddingComment] = useState(false);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        setAddingComment(true);
        setAlert({ type: "", message: "" });
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
                post.comments = data.post.comments;
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
                                        placeholderInitials={currUser.displayName[0]}
                                        img={comment.user?.photoURL}
                                        alt={comment.user?.displayName || "Anonymous"}
                                        size="sm"
                                    />
                                    <span className="text-xs font-semibold italic text-gray-800 dark:text-white">
                                        {comment.user?.displayName || "Anonymous"}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </span>
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
