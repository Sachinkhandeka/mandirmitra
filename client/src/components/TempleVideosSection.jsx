import { Button, Label, TextInput, Spinner, Tooltip, Textarea } from "flowbite-react";
import { useState } from "react";
import { fetchWithAuth, getYouTubeEmbedUrl, refreshSuperAdminOrUserAccessToken } from "../utilityFunx";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function TempleVideosSection({ temple, setTemple, setAlert }) {
    const navigate = useNavigate();
    const [videoInfo, setVideoInfo] = useState({
        title: "",
        description: "",
        url: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedTitleIndex, setExpandedTitleIndex] = useState(null); 
    const [expandedDescIndex, setExpandedDescIndex] = useState(null);

    const MAX_TITLE_LENGTH = 30;
    const MAX_DESC_LENGTH = 60;

    const toggleExpandTitle = (index) => {
        setExpandedTitleIndex(expandedTitleIndex === index ? null : index); 
    };

    const toggleExpandDesc = (index) => {
        setExpandedDescIndex(expandedDescIndex === index ? null : index); 
    };

    const handleOnChange = (e) => {
        const { id, value } = e.target;
        setVideoInfo({ ...videoInfo, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const embedUrl = getYouTubeEmbedUrl(videoInfo.url);
        if (!embedUrl) {
            setAlert({ type: "error", message: "Please enter a valid YouTube URL in the embed format." });
            setIsSubmitting(false);
            return;
        }

        const newVideo = {
            title: videoInfo.title,
            description: videoInfo.description,
            url: embedUrl,
        };

        const updatedVideos = {
            videos: [...temple.videos, newVideo],
        };

        try {
            const data = await fetchWithAuth(
                `/api/temple/edit/${temple._id}/videos`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ templeData: updatedVideos }),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setIsSubmitting,
                setAlert,
                navigate
            );
            if (data) {
                setTemple(data.temple);
                setAlert({ type: "success", message: "Video added successfully!" });
                setVideoInfo({ title: "", description: "", url: "" });
            }
        } catch (error) {
            console.error(error);
            setAlert({ type: "error", message: "Error adding video. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteVideo = async (index) => {
        const updatedVideos = {
            videos: temple.videos.filter((_, i) => i !== index),
        };

        try {
            const data = await fetchWithAuth(
                `/api/temple/edit/${temple._id}/videos`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ templeData: updatedVideos }),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setIsSubmitting,
                setAlert,
                navigate
            );
            if (data) {
                setTemple(data.temple);
                setAlert({ type: "success", message: "Video removed successfully!" });
            }
        } catch (error) {
            console.error(error);
            setAlert({ type: "error", message: "Error removing video. Please try again." });
        }
    };

    return (
        <section className="p-4 shadow-md rounded-md bg-white dark:bg-slate-800 mb-2">
            <h3 className="text-xl font-bold mb-4">Temple Videos</h3>

            {/* Form for adding a new video */}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">Video Title</Label>
                        <TextInput
                            placeholder="Enter video title"
                            name="title"
                            id="title"
                            value={videoInfo.title}
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="url">YouTube Video URL</Label>
                        <TextInput
                            type="url"
                            placeholder="Enter YouTube video URL"
                            name="url"
                            id="url"
                            value={videoInfo.url}
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2 col-span-1 lg:col-span-2">
                        <Label htmlFor="description">Video Description</Label>
                        <Textarea
                            type="text"
                            placeholder="Enter video description"
                            name="description"
                            id="description"
                            rows={4}
                            value={videoInfo.description}
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                </div>

                <Button type="submit" color="blue" className="my-6" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Spinner size="sm" light className="mr-2" />
                            <span className="animate-pulse">Saving...</span>
                        </>
                    ) : (
                        "Add Video"
                    )}
                </Button>
            </form>

            {/* Horizontal scrollable video cards */}
            {temple.videos && temple.videos.length > 0 && (
                <div className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hidden pb-4">
                    {temple.videos.map((video, index) => {
                        const isTitleExpanded = expandedTitleIndex === index;
                        const isDescExpanded = expandedDescIndex === index;

                        const truncatedTitle = video.title.length > MAX_TITLE_LENGTH
                            ? `${video.title.slice(0, MAX_TITLE_LENGTH)}...`
                            : video.title;

                        const truncatedDescription = video.description.length > MAX_DESC_LENGTH
                            ? `${video.description.slice(0, MAX_DESC_LENGTH)}...`
                            : video.description;

                        return (
                            <div
                                key={index}
                                className="min-w-[90%] md:min-w-[45%] xl:min-w-[30%] flex-shrink-0 snap-center relative bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg"
                            >
                                {/* Video iframe */}
                                <iframe
                                    width="100%"
                                    height="200"
                                    src={video.url}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="rounded-t-lg"
                                ></iframe>

                                {/* Video details */}
                                <div className="p-4 max-w-80">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                                        {isTitleExpanded ? video.title : truncatedTitle}
                                        {video.title.length > MAX_TITLE_LENGTH && (
                                            <button
                                                onClick={() => toggleExpandTitle(index)}
                                                className="text-blue-700 dark:text-yellow-300 hover:underline text-xs font-extralight ml-2"
                                            >
                                                {isTitleExpanded ? "Show less" : "Read more"}
                                            </button>
                                        )}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        {isDescExpanded ? video.description : truncatedDescription}
                                        {video.description.length > MAX_DESC_LENGTH && (
                                            <button
                                                onClick={() => toggleExpandDesc(index)}
                                                className="text-blue-700 dark:text-yellow-300 hover:underline text-xs font-extralight ml-2"
                                            >
                                                {isDescExpanded ? "Show less" : "Read more"}
                                            </button>
                                        )}
                                    </p>
                                </div>

                                {/* Delete icon button */}
                                <button
                                    className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600 text-red-600 p-2 rounded-full"
                                    onClick={() => handleDeleteVideo(index)}
                                >
                                    <Tooltip content="Delete Video">
                                        <MdDeleteForever size={20} />
                                    </Tooltip>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
