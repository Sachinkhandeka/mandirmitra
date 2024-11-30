import { useState } from "react";
import { Button, FloatingLabel, Spinner } from "flowbite-react";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";

export default function EditPost({ post, onUpdate, setAlert, closeEdit }) {
    const [editPostData, setEditPostData] = useState({
        title: post.title,
        content: post.content,
        postType: post.postType,
    });
    const [loading, setLoading] = useState(false);

    const handleEditSubmit = async () => {
        setLoading(true);
        setAlert({ type: "", message: "" });
        try {
            const data = await fetchWithAuth(
                `/api/post/${post._id}`,
                {
                    method: "PUT",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ post : editPostData }),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert
            );

            if (data) {
                setAlert({ type: "success", message: "Post updated successfully!" });
                onUpdate(); // Callback to refresh the post list
                closeEdit(); // Close the edit form
            }
        } catch (error) {
            setAlert({ type: "error", message: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 my-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <FloatingLabel
                variant="standard"
                value={editPostData.title}
                label="Post Title"
                sizing="sm"
                onChange={(e) =>
                    setEditPostData({ ...editPostData, title: e.target.value })
                }
                className="mb-4"
            />
            <FloatingLabel
                variant="standard"
                value={editPostData.content}
                label="Post Content"
                sizing="sm"
                onChange={(e) =>
                    setEditPostData({ ...editPostData, content: e.target.value })
                }
                className="mb-4"
            />
            <div className="flex gap-4">
                <Button onClick={handleEditSubmit} color="blue" disabled={loading}>
                    {loading ? <Spinner light size="sm" className="mr-2" /> : "Save"}
                </Button>
                <Button onClick={closeEdit} color="gray">
                    Cancel
                </Button>
            </div>
        </div>
    );
}
