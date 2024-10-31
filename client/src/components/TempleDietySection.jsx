import { Avatar, Button, FileInput, Label, Modal, TextInput, Textarea, Spinner } from "flowbite-react";
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { refreshToken, uploadImages } from "../utilityFunx";
import DietyList from "./DietyList";

export default function TempleDietySection({ temple, setTemple, setAlert }) {
    const [selectedImage, setSelectedImage] = useState(null); 
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [uploadingText, setUploadingText] = useState(""); 
    const [uploadProgress, setUploadProgress] = useState(null);
    const [dietyImageFile, setDietyImageFile] = useState(null); 
    const [dietyImagePreview, setDietyImagePreview] = useState(null);
    const [dietyInfo, setDietyInfo] = useState({
        dietyName: "",
        description: "",
        dietyImage: "", 
    });

    // Load initial data if the temple prop has deity data
    useEffect(() => {
        if (temple) {
            setDietyInfo({
                dietyName: "",
                description: "",
                dietyImage: "", // Reset form fields for adding a new deity
            });
            setDietyImagePreview(null); // Clear image preview when loading initial data
        }
    }, [temple]);

    // Handle form input changes
    const handleOnChange = (e) => {
        const { id, value, files } = e.target;
        if (id === "dietyImage" && files.length > 0) {
            const file = files[0]; // Single file for diety image
            setDietyImageFile(file); // Set file for Firebase upload
            setDietyImagePreview(URL.createObjectURL(file)); // Preview the selected image
        } else {
            setDietyInfo({ ...dietyInfo, [id]: value }); // Update deity info (name, description)
        }
    };

    // Remove the selected deity image
    const handleImgRemoval = () => {
        setDietyImageFile(null); // Remove the file for Firebase upload
        setDietyImagePreview(null); // Remove image preview
        setDietyInfo({ ...dietyInfo, dietyImage: "" }); // Remove Firebase URL from deity info
    };

    // Open modal to preview image
    const handleOpenModal = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    };

    // Handle form submission to save deity info
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUploadingText("Saving...");

        try {
            let dietyImageUrl = dietyInfo.dietyImage; // Keep existing image URL if no new image is selected

            // Upload the new image to Firebase, if selected
            if (dietyImageFile) {
                setUploadingText("Uploading Image...");
                await refreshToken(); // Refresh token before making authenticated requests

                const uploadResult = await uploadImages(
                    [dietyImageFile], 
                    setUploadProgress, 
                    setIsSubmitting, 
                    setAlert 
                );
                dietyImageUrl = uploadResult[0]; 
            }

            // Prepare updated deity info for the backend
            const newDiety = {
                name: dietyInfo.dietyName,
                description: dietyInfo.description,
                image: dietyImageUrl,
            };

            // Append new deity to the existing list of deities
            const updatedDieties = {
                godsAndGoddesses : [...temple.godsAndGoddesses, newDiety]
            };
            // Backend API call to update the deities in the temple
            const response = await fetch(`/api/temple/edit/${temple._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ templeData: updatedDieties }),
            });

            const data = await response.json();
            if (!response.ok) {
                return setAlert({ type: "error", message: data.message });
            }
            setTemple(data.temple);
            setAlert({ type: "success", message: "Deity added successfully!" });
        } catch (error) {
            setAlert({ type: "error", message: "Error saving deity information. Please try again." });
        } finally {
            setIsSubmitting(false);
            setUploadingText("");
        }
    };

    return (
        <section className="p-4 shadow-md rounded-md bg-white dark:bg-slate-800 mb-2">
            <h3 className="text-xl font-bold mb-4">Deity/God Worshipped</h3>
            {/* Form for adding a new deity */}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="dietyName">God Name</Label>
                        <TextInput
                            type="text"
                            placeholder="Enter god name"
                            name="dietyName"
                            id="dietyName"
                            value={dietyInfo.dietyName}
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="dietyImage">Deity/God Image</Label>
                        <FileInput
                            name="dietyImage"
                            id="dietyImage"
                            accept="image/*"
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2 col-span-1 lg:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            name="description"
                            id="description"
                            placeholder="Describe the god..."
                            rows={6}
                            value={dietyInfo.description}
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                </div>
                {dietyImagePreview && (
                    <>
                        <h2 className="text-xl font-bold my-4">Selected Image</h2>
                        <div className="relative inline-block">
                            <Avatar
                                img={dietyImagePreview} // Preview the selected image
                                size="lg"
                                stacked
                                onClick={() => handleOpenModal(dietyImagePreview)} // Show full image in modal
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
            {/* Display list of deities */}
            {temple.godsAndGoddesses && temple.godsAndGoddesses.length > 0 && (
                <DietyList temple={temple} setTemple={setTemple} setAlert={setAlert} />
            )}

            {/* Modal to show full-width image */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>Image Preview</Modal.Header>
                <Modal.Body>
                    {selectedImage && <img src={selectedImage} alt="Selected deity" className="w-full" />}
                </Modal.Body>
            </Modal>
        </section>
    );
}
