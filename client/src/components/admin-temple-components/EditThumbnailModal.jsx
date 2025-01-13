import { Modal, Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken, refreshToken, uploadImages } from "../../utilityFunx";
import { useNavigate } from "react-router-dom";

export default function EditThumbnailModal({
    showThumbnailVideoModal,
    setShowThumbnailVideoModal,
    temple,
    setTemple,
    setAlert,
}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [generalInfo, setGeneralInfo] = useState({
        templeName: "",
        location: "",
        hoverPreviewVideo: "",
    });
    const [hoverPreviewVideoFile, setHoverPreviewVideoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [deleting, setIsDeleting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Load initial temple data into state
    useEffect(() => {
        if (temple) {
            setGeneralInfo({
                templeName: temple.name || "",
                location: temple.location || "",
                hoverPreviewVideo: temple.hoverPreviewVideo || "",
            });
            setPreviewUrl(temple.hoverPreviewVideo || "");
        }
    }, [temple]);

    // Handle video file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Validate file type
            if (!file.type.startsWith("video/")) {
                setAlert({ type: "error", message: "Please upload a valid video file." });
                return;
            }

            setHoverPreviewVideoFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Submit the updated data to the backend
    const handleSubmit = async () => {
        if (!hoverPreviewVideoFile) {
            setAlert({ type: "error", message: "Please select a video to upload." });
            return;
        }

        try {
            setLoading(true);
            setAlert({ type: "", message: "" });

            await refreshToken();
            const downloadVideoURL = await uploadImages(hoverPreviewVideoFile, setUploadProgress, setLoading, setAlert);
            const videoURL = downloadVideoURL && downloadVideoURL.length > 0 ? downloadVideoURL[0] : null;
            // Prepare FormData to include the hoverPreviewVideo file
            const updatedInfo = {
                name : generalInfo.templeName,
                location : generalInfo.location,
                hoverPreviewVideo : videoURL,
            }
            const data = await fetchWithAuth(
                `/api/temple/edit/${temple._id}/genInfo`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ templeData: updatedInfo }),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );

            if (data) {
                setAlert({ type: "success", message: "Video saved successfully!" });

                // Update local temple state
                setTemple((prev) => ({
                    ...prev,
                    hoverPreviewVideo: updatedInfo.hoverPreviewVideo,
                }));
                setShowThumbnailVideoModal(false);
            }
        } catch (error) {
            setAlert({ type: "error", message: "Failed to save video. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleVideoRemoval = async() => {
        setIsDeleting(true);
        setHoverPreviewVideoFile(null);
        setGeneralInfo((prev) => ({ ...prev, hoverPreviewVideo: "" }));
        setPreviewUrl("");
        try {
            // Prepare FormData to include the hoverPreviewVideo file
            const updatedInfo = {
                name : generalInfo.templeName,
                location : generalInfo.location,
                hoverPreviewVideo : "",
            }
            const data = await fetchWithAuth(
                `/api/temple/edit/${temple._id}/genInfo`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({templeData: updatedInfo}),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );

            if (data) {
                setAlert({ type: "success", message: "Video removed successfully!" });
                // Update local temple state
                setTemple((prev) => ({
                    ...prev,
                    hoverPreviewVideo: "",
                }));
                setShowThumbnailVideoModal(false);
                setIsDeleting(false);
            }
            setIsDeleting(false);
        } catch (error) {
            setIsDeleting(faalse);
            setAlert({ type : "error", message : error.message });
            setShowThumbnailVideoModal(false);
        }
    };

    return (
        <Modal
            show={showThumbnailVideoModal}
            onClose={() => setShowThumbnailVideoModal(false)}
            size="xl"
        >
            <Modal.Header>Update Thumbnail Video</Modal.Header>
            <Modal.Body>
                {/* Preview Current Video */}
                {previewUrl && (
                    <div className="mb-4">
                        <video src={previewUrl} controls className="w-full h-64 rounded-md" disabled={loading || deleting} />
                    </div>
                )}

                {/* Upload New Video */}
                <div className="mb-4">
                    <label
                        htmlFor="hoverPreviewVideo"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Upload a new video:
                    </label>
                    <input
                        type="file"
                        id="hoverPreviewVideo"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                        disabled={loading || deleting}
                    />
                    <p className="text-xs text-gray-500" >
                        *The thumbnail video provides a captivating and concise visual introduction to the temple, highlighting its significance, history, and uniqueness.
                    </p>
                </div>
            </Modal.Body>
            <Modal.Footer className="flex items-center justify-between" >
                <div className="flex items-center gap-4" >
                    {/* Cancel Button */}
                    <Button onClick={() => setShowThumbnailVideoModal(false)} color="gray" disabled={loading || deleting}>
                        Cancel
                    </Button>
                    {/* Save Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading || deleting}
                        color="blue"
                        className={`flex items-center gap-2 px-4 py-2 bg-orange-500 text-white 
                            rounded-lg shadow hover:bg-orange-600 ${loading ? 'animate-pulse' : ''}`}
                    >
                        { loading ? <Spinner color="failure" size="sm" aria-label="Loading spinner" />: 'Save' }
                    </button>
                </div>
                <Button color="failure" onClick={handleVideoRemoval} disabled={deleting || loading}>
                    {deleting ? (
                        <Spinner color="failure" size="sm" aria-label="Deleting spinner" />
                    ) : (
                        "Delete"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
