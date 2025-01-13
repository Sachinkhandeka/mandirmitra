import { Modal, Spinner } from "flowbite-react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useState, useRef } from "react";
import {
    uploadImages,
    refreshToken,
    fetchWithAuth,
    refreshSuperAdminOrUserAccessToken,
} from "../../utilityFunx";

export default function EditTempleProfileModal({
    showProfileModal,
    setShowProfileModal,
    temple,
    setTemple,
    setAlert,
}) {
    const [tempImgUrl, setTempImgUrl] = useState(temple?.image || '');
    const [loading, setLoading] = useState(false);
    const [uploadingText, setUploadingText] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);

    const fileInputRef = useRef(null); // Reference for the hidden input

    // Handle the image change and upload process
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempImgUrl(URL.createObjectURL(file));
            try {
                setLoading(true);
                setUploadingText("Uploading...");
                await refreshToken();

                const downloadURLs = await uploadImages(
                    [file],
                    setUploadProgress,
                    setLoading,
                    setAlert
                );

                if (downloadURLs.length > 0) {
                    const downloadURL = downloadURLs[0];
                    setTempImgUrl(downloadURL);
                    setUploadingText("Saving...");
                    await saveImageInDb(downloadURL);
                }
            } catch (error) {
                setAlert({ type: "error", message: error.message });
            } finally {
                setLoading(false);
                setUploadingText("");
            }
        }
    };

    // Save the image URL in the database
    const saveImageInDb = async (downloadURL) => {
        try {
            const updatedData = {
                name : temple.name,
                location : temple.location, 
                image: downloadURL };
            const response = await fetchWithAuth(
                `/api/temple/edit/${temple._id}/genInfo`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ templeData : updatedData }),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert
            );

            if (response) {
                setShowProfileModal(false);
                setAlert({ type: "success", message: "Profile photo updated successfully!" });
                setTemple((prevTemple) => ({ ...prevTemple, ...updatedData })); 
            }
        } catch (error) {
            setShowProfileModal(false);
            setAlert({ type: "error", message: error.message });
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <Modal show={showProfileModal} onClose={() => setShowProfileModal(false)} size="xl">
            <Modal.Header className="bg-gray-800 text-white">
                <span className="text-white font-bold text-xl">Update Profile Photo</span>
            </Modal.Header>
            <Modal.Body className="bg-gray-800 text-white">
                <div className="flex flex-col items-center">
                    <img
                        src={tempImgUrl || temple.image}
                        alt={temple.name}
                        className="cursor-pointer w-full h-auto max-h-[300px] object-fill rounded-lg"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer className="bg-gray-800 text-white">
                <button
                    onClick={() => setShowProfileModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    onClick={triggerFileInput}
                    className={`flex items-center gap-2 px-4 py-2 bg-orange-500 text-white 
                        rounded-lg shadow hover:bg-orange-600 ${loading ? 'animate-pulse' : ''}`}
                    disabled={loading}
                >
                    {loading ?
                        <Spinner color="failure" size="sm" aria-label="Loading spinner" /> :
                        <FaCloudUploadAlt className="mr-2 h-5 w-5" />}
                    {loading ? uploadingText : "Change Picture"}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                />
            </Modal.Footer>
        </Modal>
    );
}
