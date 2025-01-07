import { Avatar, Button, FileInput, Label, Modal, TextInput, Spinner } from "flowbite-react";
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { refreshToken, uploadImages } from "../utilityFunx";
import DietyList from "./DietyList";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../utilityFunx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

export default function TempleDietySection({ temple, setTemple, setAlert }) {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingText, setUploadingText] = useState("");
    const [uploadProgress, setUploadProgress] = useState(null);
    const [dietyImageFile, setDietyImageFile] = useState(null);
    const [dietyImagePreview, setDietyImagePreview] = useState(null);
    const [dietyInfo, setDietyInfo] = useState({
        dietyName: "",
        description: "", // Will use ReactQuill here
        dietyImage: "",
    });

    useEffect(() => {
        if (temple) {
            setDietyInfo({
                dietyName: "",
                description: "",
                dietyImage: "",
            });
            setDietyImagePreview(null);
        }
    }, [temple]);

    const handleOnChange = (e) => {
        const { id, value, files } = e.target;
        if (id === "dietyImage" && files.length > 0) {
            const file = files[0];
            setDietyImageFile(file);
            setDietyImagePreview(URL.createObjectURL(file));
        } else {
            setDietyInfo({ ...dietyInfo, [id]: value });
        }
    };

    const handleDescriptionChange = (value) => {
        setDietyInfo({ ...dietyInfo, description: value }); // Update deity description
    };

    const handleImgRemoval = () => {
        setDietyImageFile(null);
        setDietyImagePreview(null);
        setDietyInfo({ ...dietyInfo, dietyImage: "" });
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
            let dietyImageUrl = dietyInfo.dietyImage;

            if (dietyImageFile) {
                setUploadingText("Uploading Image...");
                await refreshToken();

                const uploadResult = await uploadImages(
                    [dietyImageFile],
                    setUploadProgress,
                    setIsSubmitting,
                    setAlert
                );
                dietyImageUrl = uploadResult[0];
            }

            const newDiety = {
                name: dietyInfo.dietyName,
                description: dietyInfo.description, // Rich text from ReactQuill
                image: dietyImageUrl,
            };

            const updatedDieties = {
                godsAndGoddesses: [...temple.godsAndGoddesses, newDiety],
            };

            const data = await fetchWithAuth(
                `/api/temple/edit/${temple._id}/gods`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ templeData: updatedDieties }),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setIsSubmitting,
                setAlert,
                navigate
            );
            if (data) {
                setTemple(data.temple);
                setAlert({ type: "success", message: "Deity added successfully!" });
            }
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
                    <div className="flex flex-col gap-2 col-span-1 lg:col-span-2 mb-6">
                        <Label htmlFor="description">Description</Label>
                        <ReactQuill
                            theme="snow"
                            value={dietyInfo.description}
                            onChange={handleDescriptionChange}
                            className="bg-white dark:bg-slate-700 mb-6"
                            placeholder="Describe the god..."
                        />
                    </div>
                </div>
                {dietyImagePreview && (
                    <>
                        <h2 className="text-xl font-bold my-4">Selected Image</h2>
                        <div className="relative inline-block">
                            <Avatar
                                img={dietyImagePreview}
                                size="lg"
                                stacked
                                onClick={() => handleOpenModal(dietyImagePreview)}
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
            {temple.godsAndGoddesses && temple.godsAndGoddesses.length > 0 && (
                <DietyList temple={temple} setTemple={setTemple} setAlert={setAlert} />
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>Image Preview</Modal.Header>
                <Modal.Body>
                    {selectedImage && <img src={selectedImage} alt="Selected deity" className="w-full" />}
                </Modal.Body>
            </Modal>
        </section>
    );
}
