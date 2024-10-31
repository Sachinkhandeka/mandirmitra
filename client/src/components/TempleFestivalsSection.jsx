import { Avatar, Button, FileInput, Label, Textarea, TextInput, Modal, Spinner } from "flowbite-react";
import { FiX } from "react-icons/fi";
import { useState } from "react";
import { refreshToken ,uploadImages } from "../utilityFunx"; // Firebase image upload function
import FestivalList from "./FestivalList";

export default function TempleFestivalsSection({ temple, setTemple, setAlert }) {
    const [festivals, setFestivals] = useState({
        festivalName: "",
        festivalImportance: "",
        festivalImages: [],
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [uploadingText, setUploadingText] = useState("");

    const handleImageSelection = (e) => {
        const files = e.target.files;
        const fileArray = Array.from(files);

        const imageArray = fileArray.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file),
            file,
        }));

        setFestivals((prevFestivals) => ({
            ...prevFestivals,
            festivalImages: [...prevFestivals.festivalImages, ...imageArray],
        }));
    };

    const handleRemoveImage = (index) => {
        setFestivals((prevFestivals) => ({
            ...prevFestivals,
            festivalImages: prevFestivals.festivalImages.filter((_, i) => i !== index),
        }));
    };

    const handleOpenModal = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUploadingText("Saving...");

        try {
            let uploadedImageUrls = [];

            // Upload festival images to Firebase
            if (festivals.festivalImages.length > 0) {
                setUploadingText("Uploading Images...");
                await refreshToken();
                const imagesToUpload = festivals.festivalImages.map((img) => img.file);
                uploadedImageUrls = await uploadImages(
                    imagesToUpload,
                    setUploadProgress,
                    setIsSubmitting,
                    setAlert
                );
            }

            // Prepare festival data to be sent to the backend
            const newFestival = {
                festivalName: festivals.festivalName,
                festivalImportance: festivals.festivalImportance,
                festivalImages: uploadedImageUrls,
            };

            const updatedFestivals = {
                festivals : [...temple.festivals, newFestival]
            };
            // Backend API call to update festivals
            const response = await fetch(`/api/temple/edit/${temple._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ templeData: updatedFestivals }),
            });

            const data = await response.json();
            if (!response.ok) {
                return setAlert({ type: "error", message: data.message });
            }

            // Update temple with new festivals
            setTemple(data.temple);
            setAlert({ type: "success", message: "Festival added successfully!" });
            setFestivals({
                festivalName: "",
                festivalImportance: "",
                festivalImages: [],
            });
        } catch (error) {
            setAlert({ type: "error", message: "Error saving festival information. Please try again." });
        } finally {
            setIsSubmitting(false);
            setUploadingText("");
        }
    };

    return (
        <section className="p-4 shadow-md rounded-md bg-white dark:bg-slate-800 mb-2">
            <h3 className="text-xl font-bold mb-4">Festivals</h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="festivalName">Festival Name</Label>
                        <TextInput
                            type="text"
                            placeholder="Festival name"
                            name="festivalName"
                            id="festivalName"
                            value={festivals.festivalName}
                            onChange={(e) =>
                                setFestivals({ ...festivals, festivalName: e.target.value })
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="festivalImages">Festival Images</Label>
                        <FileInput
                            type="file"
                            name="festivalImages"
                            id="festivalImages"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelection}
                        />
                    </div>
                    <div className="flex flex-col gap-2 col-span-1 lg:col-span-2">
                        <Label htmlFor="festivalImportance">Festival Importance</Label>
                        <Textarea
                            name="festivalImportance"
                            id="festivalImportance"
                            placeholder="Add importance of the festival..."
                            rows={6}
                            value={festivals.festivalImportance}
                            onChange={(e) =>
                                setFestivals({ ...festivals, festivalImportance: e.target.value })
                            }
                        />
                    </div>
                </div>

                {/* Display selected images */}
                {festivals.festivalImages.length > 0 && (
                    <>
                        <h2 className="text-xl font-bold my-4">Selected Images</h2>
                        <div className="flex flex-row flex-wrap gap-2">
                            {festivals.festivalImages.map((img, index) => (
                                <div className="relative group" key={index}>
                                    <Avatar
                                        img={img.url}
                                        size="lg"
                                        stacked
                                        onClick={() => handleOpenModal(img.url)}
                                        className="cursor-pointer"
                                    />
                                    <button
                                        className="absolute top-0 right-0 bg-white text-black p-1 dark:bg-gray-600 dark:text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        <FiX size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <Button color={"blue"} className="my-6" disabled={isSubmitting} onClick={handleSubmit}>
                    {isSubmitting ? (
                        <Spinner light size="sm" className="mr-2" />
                    ) : (
                        "Save All"
                    )}
                    {isSubmitting && uploadingText}
                </Button>
            </form>
            {/* Display list of festivals */}
            { temple.festivals && temple.festivals.length > 0 && (
                <FestivalList temple={temple} setTemple={setTemple} setAlert={setAlert}  />
            ) }
            {/* Modal to show full-width image */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>Image Preview</Modal.Header>
                <Modal.Body>
                    {selectedImage && <img src={selectedImage} alt="Selected festival" className="w-full" />}
                </Modal.Body>
            </Modal>
        </section>
    );
}
