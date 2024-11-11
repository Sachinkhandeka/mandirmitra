import { Button, Label, TextInput, Spinner, Tooltip, Textarea } from "flowbite-react";
import { useState } from "react";
import { getYouTubeEmbedUrl } from "../utilityFunx";
import { MdDeleteForever } from "react-icons/md";

export default function TempleVideosSection({ temple, setTemple, setAlert }) {
    const [videoInfo, setVideoInfo] = useState({
        title: "",
        description: "",
        url: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input changes
    const handleOnChange = (e) => {
        const { id, value } = e.target;
        setVideoInfo({ ...videoInfo, [id]: value });
    };

    // Handle form submission for adding a new video
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
            const response = await fetch(`/api/temple/edit/${temple._id}/videos`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ templeData: updatedVideos }),
            });

            const data = await response.json();
            if (!response.ok) {
                setAlert({ type: "error", message: data.message });
            } else {
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

    // Handle video deletion
    const handleDeleteVideo = async (index) => {
        const updatedVideos = {
            videos: temple.videos.filter((_, i) => i !== index),
        };

        try {
            const response = await fetch(`/api/temple/edit/${temple._id}/videos`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ templeData: updatedVideos }),
            });

            const data = await response.json();
            if (!response.ok) {
                setAlert({ type: "error", message: data.message });
            } else {
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
                            rows={6}
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

            {/* Display the list of existing videos */}
            {temple.videos && temple.videos.length > 0 && (
                <div className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hidden mt-4 pb-4">
                    {temple.videos.map((video, index) => (
                        <div
                            key={index}
                            className="min-w-[90%] md:min-w-[45%] xl:min-w-[30%] flex-shrink-0 snap-center relative overflow-hidden group rounded-lg shadow-lg"
                        >
                            {/* Video iframe */}
                            <iframe
                                width="100%"
                                height="215"
                                src={video.url}
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded-t-lg"
                            ></iframe>

                            {/* Video details */}
                            <div className="p-4 bg-white dark:bg-gray-800">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                                    {video.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                                    {video.description}
                                </p>
                            </div>

                            {/* Delete icon button */}
                            <button
                                className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600 text-black p-1 rounded-full hover:bg-white"
                                onClick={() => handleDeleteVideo(index)}
                                aria-label="Delete video"
                            >
                                <Tooltip content={"Delete Video"} trigger="hover" >
                                    <MdDeleteForever size={20} className="text-red-600 dark:text-white" />
                                </Tooltip>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
