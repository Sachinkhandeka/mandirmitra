import { Avatar, Button, FileInput, Label, Modal, TextInput, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken, refreshToken, uploadImages } from "../utilityFunx";
import { useNavigate } from "react-router-dom";

export default function TempleGeneralInfoSection({ temple, setAlert }) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingText, setUploadingText] = useState("");
    const [uploadProgress, setUploadProgress] = useState(null);
    const [imgFiles, setImgFiles] = useState([]); 
    const [imagePreviews, setImagePreviews] = useState([]);
    const [generalInfo, setGeneralInfo] = useState({
        templeName: "",
        alternateName: "",
        address: "",
        founded: 0,
        history: "",
        historyImages: [],
    });

    useEffect(() => {
        if (temple) {
            setGeneralInfo({
                templeName: temple.name || "",
                alternateName: temple.alternateName || "",
                address: temple.location || "",
                founded: temple.foundedYear || 0,
                history: temple.description || "",
                historyImages: temple.historyImages || [],
            });
            setImagePreviews(temple.historyImages || []);
        }
    }, [temple]);

    const handleOnChange = (e) => {
        const { id, value, files } = e.target;

        if (id === "historyImages" && files.length > 0) {
            const fileArray = Array.from(files);
            setImgFiles(prevFiles => [...prevFiles, ...fileArray]);
            const newImagePreviews = fileArray.map(file => URL.createObjectURL(file));
            setImagePreviews(prevPreviews => [...prevPreviews, ...newImagePreviews]);
        } else {
            setGeneralInfo({ ...generalInfo, [id]: value });
        }
    };

    const handleHistoryChange = (value) => {
        setGeneralInfo({ ...generalInfo, history: value });
    };

    const handleImgRemoval = (index) => {
        setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));

        if (index >= temple.historyImages.length) {
            setImgFiles(prevFiles => prevFiles.filter((_, i) => i !== index - temple.historyImages.length));
        } else {
            setGeneralInfo(prevInfo => ({
                ...prevInfo,
                historyImages: prevInfo.historyImages.filter((_, i) => i !== index),
            }));
        }
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
            let downloadURLs = [...generalInfo.historyImages];

            if (imgFiles.length > 0) {
                setUploadingText("Uploading...");
                await refreshToken();
                const newUploadURLs = await uploadImages(imgFiles, setUploadProgress, setIsSubmitting, setAlert);
                downloadURLs = [...downloadURLs, ...newUploadURLs];
            }

            const updatedInfo = {
                name: generalInfo.templeName,
                alternateName: generalInfo.alternateName,
                location: generalInfo.address,
                description: generalInfo.history,
                foundedYear: generalInfo.founded,
                historyImages: downloadURLs,
            };

            const data = await fetchWithAuth(
                `/api/temple/edit/${temple._id}/genInfo`,
                {
                    method: "PUT",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ templeData: updatedInfo }),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setIsSubmitting,
                setAlert,
                navigate
            );

            if (data) {
                setAlert({ type: "success", message: "Information saved successfully!" });
            }
        } catch (error) {
            setAlert({ type: "error", message: "Error saving information. Please try again." });
        } finally {
            setIsSubmitting(false);
            setUploadingText("");
        }
    };

    return (
        <section className="p-4 shadow-md rounded-md bg-white dark:bg-slate-800 mb-2">
            <h3 className="text-xl font-bold mb-4">General information</h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="templeName">Temple Name</Label>
                        <TextInput
                            type="text"
                            placeholder="temple name"
                            name="templeName"
                            id="templeName"
                            value={generalInfo.templeName}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="alternateName">Alternate Name</Label>
                        <TextInput
                            type="text"
                            placeholder="alternate name"
                            name="alternateName"
                            id="alternateName"
                            value={generalInfo.alternateName}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="address">Address</Label>
                        <TextInput
                            type="text"
                            placeholder="temple address"
                            name="address"
                            id="address"
                            value={generalInfo.address}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="founded">Founded Year</Label>
                        <TextInput
                            type="number"
                            placeholder="eg. 1998"
                            name="founded"
                            id="founded"
                            value={generalInfo.founded}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2 col-span-1 lg:col-span-2 mb-4">
                        <Label htmlFor="history">History</Label>
                        <ReactQuill
                            theme="snow"
                            value={generalInfo.history}
                            onChange={handleHistoryChange}
                            placeholder="Add complete history about the temple..."
                            className="bg-white dark:bg-slate-700 mb-6"
                        />
                    </div>
                    <div className="flex flex-col gap-2 col-span-1 lg:col-span-2 mt-4">
                        <Label htmlFor="historyImages">Related Images</Label>
                        <FileInput
                            name="historyImages"
                            id="historyImages"
                            accept="image/*"
                            multiple
                            onChange={handleOnChange}
                        />
                    </div>
                </div>

                {imagePreviews.length !== 0 && (
                    <>
                        <h2 className="text-xl font-bold my-4">Selected Images</h2>
                        <div className="flex flex-row flex-wrap gap-2">
                            {imagePreviews.map((img, index) => (
                                <div className="relative group" key={index}>
                                    <Avatar
                                        img={img}
                                        size="lg"
                                        stacked
                                        onClick={() => handleOpenModal(img)}
                                        className="cursor-pointer"
                                    />
                                    <button
                                        className="absolute top-0 right-0 bg-white text-black p-1 dark:bg-gray-600 dark:text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleImgRemoval(index)}
                                    >
                                        <FiX size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <Button color={"blue"} type="submit" className="my-6">
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

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>Image Preview</Modal.Header>
                <Modal.Body>
                    {selectedImage && <img src={selectedImage} alt="Selected Img" className="w-full" />}
                </Modal.Body>
            </Modal>
        </section>
    );
}
