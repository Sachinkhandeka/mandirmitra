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
    const [hoverPreviewVideo, setHoverPreviewVideo] = useState(null); // State for the thumbnail video
    const [generalInfo, setGeneralInfo] = useState({
        templeName: "",
        alternateName: "",
        address: "",
        founded: 0,
        history: "",
        historyImages: [],
        hoverPreviewVideo: "", // For storing the thumbnail video URL
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
                hoverPreviewVideo: temple.hoverPreviewVideo || "", // Load video if it exists
            });
            setImagePreviews(temple.historyImages || []);
            setHoverPreviewVideo(temple.hoverPreviewVideo || null);
        }
    }, [temple]);

    const handleOnChange = (e) => {
        const { id, value, files } = e.target;

        if (id === "historyImages" && files.length > 0) {
            const fileArray = Array.from(files);
            setImgFiles(prevFiles => [...prevFiles, ...fileArray]);
            const newImagePreviews = fileArray.map(file => URL.createObjectURL(file));
            setImagePreviews(prevPreviews => [...prevPreviews, ...newImagePreviews]);
        } else if (id === "hoverPreviewVideo" && files.length > 0) {
            const file = files[0];
            const videoPreview = URL.createObjectURL(file);
            setHoverPreviewVideo(videoPreview);
            setImgFiles([file]); // Store the video file for upload
        } else {
            setGeneralInfo({ ...generalInfo, [id]: value });
        }
    };

    const handleVideoRemoval = () => {
        setHoverPreviewVideo(null);
        setGeneralInfo({ ...generalInfo, hoverPreviewVideo: "" });
        setImgFiles([]); // Reset video file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUploadingText("Saving...");

        try {
            let downloadURLs = [...generalInfo.historyImages];
            let videoURL = generalInfo.hoverPreviewVideo;

            if (imgFiles.length > 0) {
                setUploadingText("Uploading...");
                await refreshToken();

                // Separate logic for images and video uploads
                if (hoverPreviewVideo) {
                    const [videoUploadURL] = await uploadImages([imgFiles[0]], setUploadProgress, setIsSubmitting, setAlert);
                    videoURL = videoUploadURL;
                } else {
                    const imageUploadURLs = await uploadImages(imgFiles, setUploadProgress, setIsSubmitting, setAlert);
                    downloadURLs = [...downloadURLs, ...imageUploadURLs];
                }
            }

            const updatedInfo = {
                name: generalInfo.templeName,
                alternateName: generalInfo.alternateName,
                location: generalInfo.address,
                description: generalInfo.history,
                foundedYear: generalInfo.founded,
                historyImages: downloadURLs,
                hoverPreviewVideo: videoURL,
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
            <h3 className="text-xl font-bold mb-4">General Information</h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {/* Temple Name and Alternate Name */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="templeName">Temple Name</Label>
                        <TextInput
                            type="text"
                            placeholder="Temple Name"
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
                            placeholder="Alternate Name"
                            name="alternateName"
                            id="alternateName"
                            value={generalInfo.alternateName}
                            onChange={handleOnChange}
                        />
                    </div>

                    {/* Thumbnail Video */}
                    <div className="flex flex-col gap-2 col-span-1 lg:col-span-2 mt-4">
                        <Label htmlFor="hoverPreviewVideo">Add Thumbnail Video</Label>
                        <FileInput
                            name="hoverPreviewVideo"
                            id="hoverPreviewVideo"
                            accept="video/mp4, video/webm"
                            onChange={handleOnChange}
                        />
                        <div className="text-xs text-gray-500" >
                            <p>
                                *The thumbnail video provides a captivating and concise visual introduction to the temple, highlighting its significance, history, and uniqueness.
                            </p>

                        </div>
                        {hoverPreviewVideo && (
                            <div className="relative max-w-md h-60 mt-4">
                                <video
                                    src={hoverPreviewVideo}
                                    className="w-full h-full rounded-md"
                                    controls
                                    autoPlay
                                    muted
                                    loop
                                    onMouseOver={(e) => e.target.play()}
                                    onMouseOut={(e) => e.target.pause()}
                                />
                                <button
                                    className="absolute top-2 right-2 bg-white p-1 text-black dark:bg-gray-600 dark:text-white rounded-full shadow-md"
                                    onClick={handleVideoRemoval}
                                >
                                    <FiX size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Address and Founded Year */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="address">Address</Label>
                        <TextInput
                            type="text"
                            placeholder="Temple Address"
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
                            placeholder="e.g. 1998"
                            name="founded"
                            id="founded"
                            value={generalInfo.founded}
                            onChange={handleOnChange}
                        />
                    </div>

                    {/* History */}
                    <div className="flex flex-col gap-2 col-span-1 lg:col-span-2 mb-4">
                        <Label htmlFor="history">History</Label>
                        <ReactQuill
                            theme="snow"
                            value={generalInfo.history}
                            onChange={value => setGeneralInfo({ ...generalInfo, history: value })}
                            placeholder="Add complete history about the temple..."
                            className="bg-white dark:bg-slate-700 mb-6"
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
                                        onClick={() => setSelectedImage(img)}
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
        </section>
    );
}
