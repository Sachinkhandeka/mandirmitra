import { Button, FileInput, Label, TextInput, Avatar, Spinner, Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { refreshToken, uploadImages } from "../utilityFunx";
import PriestList from "./PriestList";

export default function TemplePujariSection({ temple, setTemple, setAlert }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingText, setUploadingText] = useState("");
    const [uploadProgress, setUploadProgress] = useState(null);
    const [priestImageFile, setPriestImageFile] = useState(null);
    const [priestImagePreview, setPriestImagePreview] = useState(null);
    const [priestInfo, setPriestInfo] = useState({
        priestName: "",
        experience: "",
        designation: "",
        specialization: "",
        contactInfo: "",
        profile: "", 
    });

    // Load initial data if the temple prop has existing Pujaris
    useEffect(() => {
        if (temple) {
            setPriestInfo({
                priestName: "",
                experience: "",
                designation: "",
                specialization: "",
                contactInfo: "",
                profile: "", // Reset form fields for adding a new Pujari
            });
            setPriestImagePreview(null); // Clear image preview when loading initial data
        }
    }, [temple]);

    // Handle form input changes
    const handleOnChange = (e) => {
        const { id, value, files } = e.target;
        if (id === "profile" && files.length > 0) {
            const file = files[0]; 
            setPriestImageFile(file); 
            setPriestImagePreview(URL.createObjectURL(file)); // Preview the selected image
        } else {
            setPriestInfo({ ...priestInfo, [id]: value }); // Update Pujari info (name, description, etc.)
        }
    };

    // Remove the selected Pujari image
    const handleImgRemoval = () => {
        setPriestImageFile(null); // Remove the file for Firebase upload
        setPriestImagePreview(null); // Remove image preview
        setPriestInfo({ ...priestInfo, profile: "" }); // Remove Firebase URL from Pujari info
    };

    // Open modal to preview image
    const handleOpenModal = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    };

    // Handle form submission to save Pujari info
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUploadingText("Saving...");

        try {
            let priestImageUrl = priestInfo.profile; // Keep existing image URL if no new image is selected

            // Upload the new image to Firebase, if selected
            if (priestImageFile) {
                setUploadingText("Uploading Image...");
                await refreshToken(); // Refresh token before making authenticated requests

                const uploadResult = await uploadImages(
                    [priestImageFile],
                    setUploadProgress,
                    setIsSubmitting,
                    setAlert
                );
                priestImageUrl = uploadResult[0]; 
            }

            // Prepare updated Pujari info for the backend
            const newPujari = {
                name: priestInfo.priestName,
                experience: priestInfo.experience,
                designation: priestInfo.designation,
                specialization: priestInfo.specialization,
                contactInfo: priestInfo.contactInfo,
                profile: priestImageUrl,
            };

            // Append new Pujari to the existing list of Pujaris
            const updatedPujaris = {
                pujaris: [...temple.pujaris, newPujari]
            };
            
            // Backend API call to update the Pujaris in the temple
            const response = await fetch(`/api/temple/edit/${temple._id}/pujaris`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ templeData: updatedPujaris }),
            });

            const data = await response.json();
            if (!response.ok) {
                return setAlert({ type: "error", message: data.message });
            }

            setTemple(data.temple);
            setAlert({ type: "success", message: "Pujari added successfully!" });
        } catch (error) {
            console.log(error.message);
            setAlert({ type: "error", message: "Error saving Pujari information. Please try again." });
        } finally {
            setIsSubmitting(false);
            setUploadingText("");
        }
    };

    return (
        <section className="p-4 shadow-md rounded-md bg-white dark:bg-slate-800 mb-2">
            <h3 className="text-xl font-bold mb-4">Priest/Pujari associated</h3>

            {/* Form for adding a new Pujari */}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="priestName">Pujari Name</Label>
                        <TextInput
                            type="text"
                            placeholder="Enter Pujari's name"
                            name="priestName"
                            id="priestName"
                            value={priestInfo.priestName}
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="profile">Pujari Image</Label>
                        <FileInput
                            name="profile"
                            id="profile"
                            accept="image/*"
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <TextInput
                            type="number"
                            name="experience"
                            id="experience"
                            placeholder="Years of service"
                            value={priestInfo.experience}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="designation">Designation</Label>
                        <TextInput
                            type="text"
                            name="designation"
                            id="designation"
                            placeholder="Role (e.g., Head Priest)"
                            value={priestInfo.designation}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <TextInput
                            type="text"
                            name="specialization"
                            id="specialization"
                            placeholder="Expertise (e.g., Vedic rituals)"
                            value={priestInfo.specialization}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="contactInfo">Contact Info</Label>
                        <TextInput
                            type="text"
                            name="contactInfo"
                            id="contactInfo"
                            placeholder="Phone number"
                            value={priestInfo.contactInfo}
                            onChange={handleOnChange}
                            pattern="\d{10}" 
                            title="Please enter a valid 10-digit phone number."
                        />
                    </div>
                </div>

                {/* Show selected Pujari image */}
                {priestImagePreview && (
                    <>
                        <h2 className="text-xl font-bold my-4">Selected Image</h2>
                        <div className="relative inline-block">
                            <Avatar
                                img={priestImagePreview}
                                size="lg"
                                stacked
                                onClick={() => handleOpenModal(priestImagePreview)}
                                className="cursor-pointer"
                            />
                            <button
                                className="absolute top-0 right-0 bg-white text-black p-1 dark:bg-gray-600 dark:text-white rounded-full"
                                onClick={handleImgRemoval}
                            >
                                <FiX size={16} />
                            </button>
                        </div>
                    </>
                )}

                <Button type="submit" color="blue" className="my-6" disabled={isSubmitting}>
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

            {/* Display the list of existing Pujaris */}
            {temple.pujaris && temple.pujaris.length > 0 && (
                <PriestList temple={temple} setTemple={setTemple} setAlert={setAlert} />
            )}

            {/* Modal to show full-width image */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>Image Preview</Modal.Header>
                <Modal.Body>
                    {selectedImage && <img src={selectedImage} alt="Selected priest" className="w-full" />}
                </Modal.Body>
            </Modal>
        </section>
    );
}
