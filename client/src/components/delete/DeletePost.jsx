import { useState } from "react";
import { Modal, Button, Spinner } from "flowbite-react";
import { Helmet } from "react-helmet-async";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import Alert from "../Alert";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";
import { useNavigate } from "react-router-dom";

export default function DeletePost({ post, isOpen, onClose, refreshPosts, alert, setAlert }) {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        setAlert({ type: "", message: "" });

        try {
            const data = await fetchWithAuth(
                `/api/post/${post._id}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if (data) {
                setAlert({ type: "success", message: "Post deleted successfully" });
                refreshPosts();
                onClose();
            }
        } catch (err) {
            setAlert({ type: "error", message: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Delete Post Confirmation - Temple Management</title>
                <meta
                    name="description"
                    content="Confirm deletion of a post in the temple management system. Ensure your actions before proceeding."
                />
            </Helmet>
            <Modal show={isOpen} size={"md"} dismissible onClose={onClose} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-600" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete 
                            <span className="text-black ml-1 italic" >"{post.title}"</span> post?
                        </h3>
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
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDelete} disabled={loading}>
                                {loading ? <Spinner color="failure" /> : "Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={onClose}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
