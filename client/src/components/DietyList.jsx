import { Tooltip } from "flowbite-react";
import { useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../utilityFunx";

export default function DietyList({ temple, setTemple, setAlert }) {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

    // Function to toggle description length
    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    // Remove a deity from the list
    const handleRemoveDiety = async (index) => {
        const updatedDieties = {
            godsAndGoddesses: temple.godsAndGoddesses.filter((_, i) => i !== index),
        };
        setLoading(true);
        setAlert({ type : "", message : "" });
        try {
            const data = await fetchWithAuth(
                `/api/temple/edit/${temple._id}/gods`, 
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ templeData: updatedDieties }),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setTemple(data.temple);
                setAlert({ type: "success", message: "Deity removed successfully!" });
            }
        } catch (error) {
            setAlert({ type: "error", message: "Error removing deity." });
        }
    };

    return (
        <>
            <h2 className="text-xl font-bold my-4">Deity List</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {temple.godsAndGoddesses.map((diety, indx) => (
                    <div key={indx} className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
                        <div className="relative">
                            {/* Image at the top */}
                            <img src={diety.image} className="w-full h-40 object-cover" />

                            {/* Remove button */}
                            <button
                                className="absolute top-2 right-2 bg-white text-black p-1 dark:bg-gray-600 dark:text-white rounded-full opacity-75 hover:opacity-100"
                                onClick={() => handleRemoveDiety(indx)}
                            >
                                <Tooltip content={"Delete"} trigger="hover" >
                                    <MdDeleteForever size={16} className="text-red-600 dark:text-white" />
                                </Tooltip>
                            </button>
                        </div>

                        {/* Card content */}
                        <div className="p-4">
                            {/* Deity Name */}
                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{diety.name}</h1>

                            {/* Deity Description */}
                            <p
                                className={`text-gray-600 dark:text-gray-300 mt-2 text-xs transition-all duration-300 overflow-hidden ${
                                    isExpanded ? "" : "line-clamp-3"
                                }`}
                            >
                                {diety.description}
                            </p>

                            {/* Show More/Show Less */}
                            {diety.description && diety.description.length > 100 && (
                                <button
                                    className="text-blue-500 hover:underline text-sm mt-2"
                                    onClick={toggleExpanded}
                                >
                                    {isExpanded ? "Show Less" : "Show More"}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
