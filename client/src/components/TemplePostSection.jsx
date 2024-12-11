import { Button, Label, TextInput, Textarea, FileInput, Avatar, Spinner, Select } from "flowbite-react";
import { useState } from "react";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken, uploadImages, refreshToken } from "../utilityFunx";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PostList from "./PostList";

export default function TemplePostsSection({ temple, setTemple, setAlert }) {
    const { currUser } = useSelector( state => state.user );
    const navigate = useNavigate();
    const [post, setPost] = useState({
        title: "",
        content: "",
        images: [],
        postType: "general",
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [uploadingText, setUploadingText] = useState("");
    const [fetchPosts, setFetchPosts] = useState(false);

    const handleImageSelection = (e) => {
        const files = e.target.files;
        const fileArray = Array.from(files);

        const imageArray = fileArray.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file),
            file,
        }));

        setPost((prevPost) => ({
            ...prevPost,
            images: [...prevPost.images, ...imageArray],
        }));
    };

    const handleRemoveImage = (index) => {
        setPost((prevPost) => ({
            ...prevPost,
            images: prevPost.images.filter((_, i) => i !== index),
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

            // Upload images
            if (post.images.length > 0) {
                setUploadingText("Uploading Images...");
                await refreshToken();
                const imagesToUpload = post.images.map((img) => img.file);
                uploadedImageUrls = await uploadImages(
                    imagesToUpload,
                    setUploadProgress,
                    setIsSubmitting,
                    setAlert
                );
            }
            const newPost = {
                title: post.title,
                content: post.content,
                images: uploadedImageUrls,
                postType: post.postType,
            };

            // Backend API call to update posts
            const data = await fetchWithAuth(
                `/api/post/${temple._id}/${currUser._id}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ post: newPost }),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setIsSubmitting,
                setAlert,
                navigate
            );

            // Update temple with new posts
            if (data) {
                setAlert({ type: "success", message: "Post added successfully!" });
                setPost({
                    title: "",
                    content: "",
                    images: [],
                    postType: "general",
                });
                setFetchPosts(true);
            }
        } catch (error) {
            setAlert({ type: "error", message: "Error saving post information. Please try again." });
        } finally {
            setIsSubmitting(false);
            setUploadingText("");
        }
    };

    return (
        <section className="p-1 shadow-md rounded-md bg-white dark:bg-slate-800 mb-2">
            <h3 className="p-4 text-xl font-bold mb-4">Add Post</h3>
            <form onSubmit={handleSubmit} className="md:p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title">Post Title</Label>
                        <TextInput
                            type="text"
                            placeholder="Enter post title"
                            name="title"
                            id="title"
                            value={post.title}
                            onChange={(e) => setPost({ ...post, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="postType">Post Type</Label>
                        <Select
                            name="postType"
                            id="postType"
                            value={post.postType}
                            onChange={(e) => setPost({ ...post, postType: e.target.value })}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600"
                        >
                            <option value="general">General</option>
                            <option value="announcement">Announcement</option>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2 col-span-1 lg:col-span-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            name="content"
                            id="content"
                            placeholder="Enter post content"
                            rows={6}
                            value={post.content}
                            onChange={(e) => setPost({ ...post, content: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2 col-span-1 lg:col-span-2">
                        <Label htmlFor="images">Images</Label>
                        <FileInput
                            type="file"
                            name="images"
                            id="images"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelection}
                        />
                    </div>
                </div>

                {/* Display selected images */}
                {post.images.length > 0 && (
                    <>
                        <h2 className="text-xl font-bold my-4">Selected Images</h2>
                        <div className="flex flex-row flex-wrap gap-2">
                            {post.images.map((img, index) => (
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
                        "Save Post"
                    )}
                    {isSubmitting && uploadingText}
                </Button>
            </form>
            <div>
                <PostList templeId={temple._id} setAlert={setAlert} fetchPosts={fetchPosts} setFetchPosts={setFetchPosts} />
            </div>
        </section>
    );
}
