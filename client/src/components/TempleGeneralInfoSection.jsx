import { Avatar, Button, FileInput, Label, Modal, TextInput, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken, refreshToken, uploadImages } from "../utilityFunx";
import { useNavigate } from "react-router-dom";
import ImageModal from "./ImageModal";

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
        history: "",
        historyImages: [],
    });

    useEffect(() => {
        if (temple) {
            setGeneralInfo({
                history: temple.description || "",
                historyImages: temple.historyImages || [],
            });
            setImagePreviews(temple.historyImages || []);
        }
    }, [temple]);

    const handleOnChange = (e) => {
        const { id, files } = e.target;

        if (id === "historyImages" && files.length > 0) {
            const fileArray = Array.from(files);
            setImgFiles(prevFiles => [...prevFiles, ...fileArray]);
            const newImagePreviews = fileArray.map(file => URL.createObjectURL(file));
            setImagePreviews(prevPreviews => [...prevPreviews, ...newImagePreviews]);
        } else {
            setGeneralInfo({ ...generalInfo, [id]: e.target.value });
        }
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
                const imageUploadURLs = await uploadImages(imgFiles, setUploadProgress, setIsSubmitting, setAlert);
                downloadURLs = [...downloadURLs, ...imageUploadURLs];
            }

            const updatedInfo = {
                name : temple.name,
                location : temple.location,
                description: generalInfo.history,
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

    const handleImageModal = (img)=> {
        setShowModal(true);
        setSelectedImage(img);
    }
    return (
        <section className="p-4 shadow-md rounded-md bg-white dark:bg-slate-800 mb-2">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {/* History */}
                    <div className="flex flex-col gap-2 col-span-1 lg:col-span-2 mb-4">
                        <Label htmlFor="history">History</Label>
                        <ReactQuill
                            theme="snow"
                            value={generalInfo.history}
                            onChange={value => setGeneralInfo({ ...generalInfo, history: value })}
                            placeholder="Add complete history about the temple..."
                            className="bg-white dark:bg-slate-700 mb-6 h-96"
                        />
                    </div>

                    {/* Related Images */}
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

                {/* Image Previews */}
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
                                        onClick={() => handleImageModal(img)}
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

                {/* Save Button */}
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
            {
                showModal && <ImageModal isOpen={showModal} onClose={()=> setShowModal(false)} url={selectedImage} />
            }
        </section>
    );
}
