import { Carousel, Spinner } from "flowbite-react";
import StoryRenderer from "./StoryRenderer";
import EditStory from "./EditStory"; // Import the EditStory component
import { useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dropdown } from "flowbite-react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import Alert from "../Alert";

export default function StoryDisplay({ onAddNew, stories }) {
    const [showEditStory, setShowEditStory] = useState(false);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0); // Track the current story index
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type : "", message : "" });
    const { currUser } = useSelector((state) => state.user);

    if(stories.length === 0) {
        onAddNew();
    }

    // Update the current story based on index
    const handleSlideChange = (index) => {
        setCurrentStoryIndex(index);
    };

    const handleStoryDelete = async()=> {
        const storyToDelete = stories[currentStoryIndex];
        setLoading(true);
        setAlert({ type : "", message : "" });
        try {
            const response = await fetch(
                `/api/story/${storyToDelete._id}`,
                {
                    method : "DELETE",
                    headers : { "content-type" : "application/json" }
                }
            );
            const data = await response.json();

            if(!response.ok) {
                return setAlert({ type : "error", message : data.message });
            }
            const finalStoriesList = stories.filter(story => story._id !== data.story._id );
            stories.splice(0, stories.length, ...finalStoriesList);
            setAlert({ type : "success", message : data.message });

        } catch (error) {
            setAlert({ type : "error", message : error.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
        {alert && alert.message && (
            <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
        )}
        <div className="relative">
            {showEditStory ? (
                <EditStory
                    story={stories[currentStoryIndex]} // Pass the currently viewed story
                    onCancel={() => setShowEditStory(false)}
                    stories={stories}
                />
            ) : (
                <>
                    {stories?.length > 0 && currUser && currUser.isAdmin && (
                        <div className="absolute top-2 right-2 cursor-pointer z-20">
                            <Dropdown
                                label={<BsThreeDotsVertical />}
                                inline
                                arrowIcon={false}
                            >
                                <Dropdown.Item
                                    icon={FaEdit}
                                    onClick={() => setShowEditStory(true)}
                                >
                                    Edit
                                </Dropdown.Item>
                                <Dropdown.Item
                                    icon={MdDelete}
                                    onClick={handleStoryDelete}
                                    className="text-red-500"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner color="failure" aria-label="loading spinner example" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete"
                                    )}
                                </Dropdown.Item>
                            </Dropdown>
                        </div>
                    )}
                    <Carousel pauseOnHover onSlideChange={handleSlideChange}>
                        {stories?.length > 0 ? (
                            stories.map((story) => (
                                <StoryRenderer story={story} key={story._id} />
                            ))
                        ) : (
                            <div>No stories to display</div>
                        )}
                    </Carousel>
                    <button
                        className="mt-4 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                        onClick={onAddNew}
                    >
                        Add New Story
                    </button>
                </>
            )}
        </div>
        </>
    );
}
