import { useState, useEffect, useRef } from "react";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import Alert from "../Alert";
import { Spinner } from "flowbite-react";

export default function EditStory({ story, onCancel, stories }) {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type : "", message : "" });
    const [storyData, setStoryData] = useState({
        content: story?.content || "", // Initialize with story prop or empty string
        translation: story?.translation || "",
        date: story?.date || new Date(), // Use current date if not provided
        isHighlighted: story?.isHighlighted || false,
    });

    // Refs to access the textareas
    const contentRef = useRef(null);
    const translationRef = useRef(null);

    // Function to set the height of a textarea based on its content
    const adjustHeight = (textarea) => {
        if (textarea) {
            textarea.style.height = "auto"; // Reset height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set to content height
        }
    };

    useEffect(()=> {
        if(contentRef.current) {
            contentRef.current.focus();
        }
    },[]);

    // Adjust height on component mount and when `story` prop changes
    useEffect(() => {
        adjustHeight(contentRef.current);
        adjustHeight(translationRef.current);
    }, [story]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStoryData((prevData) => ({
            ...prevData,
            [name]: value, // Dynamically update the field
        }));
        adjustHeight(e.target); // Adjust height as the user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ type : "", message : "" });
        try {
            const response = await fetch(
                `/api/story/${story._id}`,
                {
                    method : "PUT",
                    headers : { "content-type" : "application/json" },
                    body : JSON.stringify({storyData})
                }
            );
            const data = await response.json();

            if(!response.ok) {
                setAlert({ typee : "error", message : data.message });
            }
            setAlert({ type : "success", message : data.message });
            const updatedStories = stories.map((s) => 
                s._id === story._id ? { ...s, ...data.story } : s
            );
            stories.splice(0, stories.length, ...updatedStories);

            setTimeout(() => {
                onCancel(); // Navigate back to stories section
            }, 2000);
            
        } catch (error) {
            setAlert({ type : "error", message : error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`w-full p-8 rounded-lg shadow-lg bg-gradient-to-r h-full from-green-300 to-teal-400 text-center`}
        >
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                )}
            </div>
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-6 text-4xl font-serif text-green-700">
                    <FaQuoteLeft className="inline-block mr-2 mb-2" />
                    <textarea
                        name="content"
                        id="content"
                        className="border-none outline-none bg-transparent text-green-700 text-4xl placeholder:text-green-700 focus:ring-transparent focus:border-none text-center w-full resize-none overflow-hidden"
                        placeholder="Type a title"
                        ref={contentRef} // Attach ref
                        onChange={handleInputChange}
                        value={storyData.content} // Controlled input
                        rows={1}
                        required
                    />
                    <FaQuoteRight className="inline-block ml-2" />
                </div>

                {/* Translation */}
                <div className="mb-6">
                    <textarea
                        name="translation"
                        id="translation"
                        className="border-none block w-full text-center outline-none bg-transparent text-black placeholder:text-black focus:ring-transparent focus:border-none text-lg resize-none overflow-hidden"
                        placeholder="Type small explanation here..."
                        ref={translationRef} // Attach ref
                        onChange={handleInputChange}
                        value={storyData.translation} // Controlled input
                        rows={1}
                        required
                    />
                </div>

                {/* Highlight Toggle */}
                <div className="flex items-center justify-center mb-8">
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={storyData.isHighlighted}
                            onChange={(e) =>
                                setStoryData((prevData) => ({
                                    ...prevData,
                                    isHighlighted: e.target.checked,
                                }))
                            }
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-500"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Highlight Story
                        </span>
                    </label>
                </div>

                {/* Submit and Cancel Buttons */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        {loading ? <Spinner color="info" aria-label="Loading spinner example" /> : "Update Story"}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-6 py-3 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
