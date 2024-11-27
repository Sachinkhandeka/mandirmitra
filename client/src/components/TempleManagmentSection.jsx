import { FileInput, Label, TextInput, Button, Avatar, Modal, Spinner } from "flowbite-react";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { refreshToken, uploadImages } from "../utilityFunx";
import ManagementList from "./ManagementList";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../utilityFunx";

export default function TempleManagementSection({ temple, setTemple, setAlert }) {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null); 
    const [uploadingText, setUploadingText] = useState(""); 
    const [templeManagement, setTempleManagement] = useState({
        personName: "",
        role: "",
        image: {},
    });

    const handleOnChange = (e) => {
        const { id, value, files } = e.target;
        if (id === "image" && files.length > 0) {
            const file = files[0];
            setTempleManagement((prevInfo) => ({
                ...prevInfo,
                image: { name: file.name, url: URL.createObjectURL(file), file }
            }));
        } else {
            setTempleManagement({ ...templeManagement, [id]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUploadingText("Saving...");

        try {
            let imageUrl = templeManagement.image.url;

            if (templeManagement.image.file) {
                setUploadingText("Uploading Image...");
                await refreshToken(); 

                const uploadResult = await uploadImages(
                    [templeManagement.image.file],
                    setUploadProgress,
                    setIsSubmitting,
                    setAlert
                );
                imageUrl = uploadResult[0];
            }

            const newManagement = {
                name: templeManagement.personName,
                role: templeManagement.role,
                profile: imageUrl,
            };

            const updatedManagement = {
                management: [...temple.management, newManagement]
            };

            // Backend API call to update the management in the temple
            const data = await fetchWithAuth(
                `/api/temple/edit/${temple._id}/management`, 
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ templeData: updatedManagement }),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setIsSubmitting,
                setAlert,
                navigate
            );
            if(data) {
                setTemple(data.temple);
                setAlert({ type: "success", message: "Management member added successfully!" });
                setTempleManagement({
                    personName: "",
                    role: "",
                    image: {},
                });
            }
        } catch (error) {
            setAlert({ type: "error", message: "Error saving management information. Please try again." });
        } finally {
            setIsSubmitting(false);
            setUploadingText("");
        }
    };

    const handleOpenModal = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    };

    const handleRemoveImage = () => {
        setTempleManagement((prevInfo) => ({
            ...prevInfo,
            image: {}
        }));
    };

    return (
        <section className="p-4 shadow-md rounded-md bg-white dark:bg-slate-800 mb-4">
            <h3 className="text-xl font-bold mb-4">Temple Management Body</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="personName">Person Name</Label>
                        <TextInput
                            type="text"
                            placeholder="Enter Person Name"
                            name="personName"
                            id="personName"
                            value={templeManagement.personName}
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="role">Role</Label>
                        <TextInput
                            type="text"
                            placeholder="Role in management"
                            name="role"
                            id="role"
                            value={templeManagement.role}
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="image">Person Image</Label>
                        <FileInput
                            name="image"
                            id="image"
                            onChange={handleOnChange}
                            accept="image/*"
                        />
                    </div>
                </div>

                {templeManagement.image.url && (
                    <>
                        <h2 className="text-xl font-bold my-4">Selected Image</h2>
                        <div className="relative inline-block">
                            <Avatar
                                img={templeManagement.image.url}
                                size="lg"
                                className="cursor-pointer"
                                onClick={() => handleOpenModal(templeManagement.image.url)}
                            />
                            <button
                                type="button"
                                className="absolute top-0 right-0 bg-white text-black dark:bg-gray-600 dark:text-white p-1 rounded-full opacity-0 hover:opacity-100"
                                onClick={handleRemoveImage}
                            >
                                <FiX size={16} />
                            </button>
                        </div>
                    </>
                )}

                <Button type="submit" color="blue" className="mt-4" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Spinner size="sm" light className="mr-2" />
                            <span className="animate-pulse">{uploadingText}</span>
                        </>
                    ) : (
                        "Save All"
                    )}
                </Button>
            </form>
            { temple.management && temple.management.length > 0 && (
                <ManagementList temple={temple} setTemple={setTemple} setAlert={setAlert} />
            ) }
            {/* Modal to show full width image */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>Image Preview</Modal.Header>
                <Modal.Body>
                    {selectedImage && <img src={selectedImage} alt="Selected Management" className="w-full" />}
                </Modal.Body>
            </Modal>
        </section>
    );
}
