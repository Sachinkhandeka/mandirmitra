import { useEffect, useRef, useState } from "react";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { Spinner } from "flowbite-react";
import Alert from "../Alert";

export default function AddStory({ onCancel, templeId, stories }) {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type : "", message : "" });
    const [storyData, setStoryData] = useState({
        content: "", 
        translation: "",
        date: new Date(),
        isHighlighted: true,
    });
    const contentRef = useRef(null);

    useEffect(()=> {
        if(contentRef.current) {
            contentRef.current.focus();
        }
    },[]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStoryData((prevData) => ({
            ...prevData,
            [name]: value, // Dynamically update based on input field's name
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert({ type : "", message : "" });
        setLoading(true);
        try {
            const response = await fetch(
                `/api/story/${templeId}`,
                {
                    method : "POST",
                    headers : { "Content-Type" : "application/json" },
                    body : JSON.stringify({storyData})
                }
            );
            const data = await response.json();

            if(!response.ok) {
                setLoading(false);
                setAlert({ type : "error", message : data.message });
            }

            setAlert({ type : "success", message : data.message });
            stories.push(data.story);
            setStoryData({
                content: "", 
                translation: "",
                date: new Date(),
                isHighlighted: true,
            });
            setLoading(false);

            setTimeout(() => {
                onCancel(); // Navigate back to stories section
            }, 2000);
            
        } catch (error) {
            setLoading(false);
            setAlert({ type : "error", message : error.message });
        }
    };

    return (
        <div
            className={`p-8 rounded-lg shadow-lg bg-gradient-to-r h-full from-yellow-300 to-orange-400 text-center mx-auto`}
        >
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                )}
            </div>
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-6 text-4xl font-serif text-red-700">
                    <FaQuoteLeft className="inline-block mr-2 mb-2" />
                    <textarea
                        name="content"
                        id="content"
                        className="border-none outline-none bg-transparent text-red-700 text-4xl placeholder:text-red-700 focus:ring-transparent focus:border-none text-center w-full resize-none overflow-hidden"
                        placeholder="Type a title"
                        ref={contentRef}
                        onChange={handleInputChange}
                        value={storyData.content} // Controlled input
                        rows={1}
                        onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height = `${e.target.scrollHeight}px`; // Auto expand
                        }}
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
                        onChange={handleInputChange}
                        value={storyData.translation} // Controlled input
                        rows={1}
                        onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height = `${e.target.scrollHeight}px`; // Auto expand
                        }}
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
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Highlight Story
                        </span>
                    </label>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="px-6 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                        disabled={loading}
                    >
                        { loading ? <Spinner color="failure" aria-label="Loading spinner example" /> : "Create Story" }
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                        disabled={loading}
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
}
