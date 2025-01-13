import { Tooltip } from "flowbite-react";
import { useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../utilityFunx";
import ImageModal from "./ImageModal";

export default function ManagementList({ temple, setTemple, setAlert }) {
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(false);
    const [ showModal, setShowModal ] = useState(false);
    const [ selectedImg, setSelectedImg ] = useState("");

    const handleRemoveManagement = async (index) => {
        const updatedManagement = {
            management: temple.management.filter((_, i) => i !== index),
        };
        setLoading(false);
        setAlert({ type : "", message : "" });
        try {
            const data = await fetchWithAuth(
                `/api/temple/edit/${temple._id}/management`, 
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ templeData: updatedManagement }),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setLoading(false);
                setTemple(data.temple);
                setAlert({ type: "success", message: "Management member removed successfully!" });
            }
        } catch (error) {
            setLoading(false);
            setAlert({ type: "error", message: "Error removing management member." });
        }
    };

    const handleShowImgModal = (img)=> {
        setSelectedImg(img);
        setShowModal(true);
    }

    return (
        <>
            <h2 className="text-xl font-bold my-4">Management Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {temple.management.map((member, index) => (
                    <div key={index} className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
                        <div className="relative">
                            <img src={member.profile} className="w-full h-40 object-cover cursor-pointer" alt="Member Image" onClick={()=> handleShowImgModal(member.profile)} />

                            <button
                                className="absolute top-2 right-2 bg-white text-black p-1 dark:bg-gray-600 dark:text-white rounded-full opacity-75 hover:opacity-100"
                                onClick={() => handleRemoveManagement(index)}
                            >
                                <Tooltip content={"Delete"} trigger="hover" >
                                    <MdDeleteForever size={16} className="text-red-600 dark:text-white" />
                                </Tooltip>
                            </button>
                        </div>

                        <div className="p-4">
                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <strong>Role:</strong> {member.role}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {
                showModal && <ImageModal isOpen={showModal} onClose={()=> setShowModal(false)} url={selectedImg} />
            }
        </>
    );
}
