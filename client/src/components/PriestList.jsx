import { Avatar, Tooltip } from "flowbite-react";
import { useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../utilityFunx";

export default function PujariList({ temple, setTemple, setAlert }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Remove a Pujari from the list
    const handleRemovePujari = async (index) => {
        const updatedPujaris = {
            pujaris: temple.pujaris.filter((_, i) => i !== index),
        };

        setLoading(false);
        setAlert({ type : "", message : "" });
        try {
            const data = await fetchWithAuth(
                `/api/temple/edit/${temple._id}/pujaris`, 
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ templeData: updatedPujaris }),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setTemple(data.temple);
                setAlert({ type: "success", message: "Pujari removed successfully!" });
            }
        } catch (error) {
            setAlert({ type: "error", message: "Error removing Pujari." });
        }
    };

    return (
        <>
            <h2 className="text-xl font-bold my-4">Pujari List</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {temple.pujaris.map((pujari, indx) => (
                    <div key={indx} className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
                        <div className="relative">
                            {/* Pujari Image */}
                            <img src={pujari.profile} className="w-full h-40 object-cover" alt="Pujari Image" />

                            {/* Remove button */}
                            <button
                                className="absolute top-2 right-2 bg-white text-black p-1 dark:bg-gray-600 dark:text-white rounded-full opacity-75 hover:opacity-100"
                                onClick={() => handleRemovePujari(indx)}
                            >
                                <Tooltip content={"Delete Pujari"} trigger="hover" >
                                    <MdDeleteForever size={16} className="text-red-600 dark:text-white" />
                                </Tooltip>
                            </button>
                        </div>

                        {/* Card content */}
                        <div className="p-4">
                            {/* Pujari Name */}
                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{pujari.name}</h1>

                            {/* Pujari Designation */}
                            {pujari.designation && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    <strong>designation : </strong> {pujari.designation}
                                </p>
                            )}

                            {/* Pujari Specialization */}
                            {pujari.specialization && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    <strong>specialization:</strong> {pujari.specialization}
                                </p>
                            )}

                            {/* Pujari Experience */}
                            {pujari.experience && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    <strong>experience:</strong> {pujari.experience} वर्ष
                                </p>
                            )}

                            {/* Pujari Contact Info */}
                            {pujari.contactInfo && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    <strong>contactInfo:</strong> {pujari.contactInfo}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
