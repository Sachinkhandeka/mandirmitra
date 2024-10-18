import { FiX } from "react-icons/fi";

export default function ManagementList({ temple, setTemple, setAlert }) {
    const handleRemoveManagement = async (index) => {
        const updatedManagement = {
            management: temple.management.filter((_, i) => i !== index),
        };

        try {
            const response = await fetch(`/api/temple/edit/${temple._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ templeData: updatedManagement }),
            });

            const data = await response.json();
            if (!response.ok) {
                return setAlert({ type: "error", message: data.message });
            }

            setTemple(data.temple);
            setAlert({ type: "success", message: "Management member removed successfully!" });
        } catch (error) {
            setAlert({ type: "error", message: "Error removing management member." });
        }
    };

    return (
        <>
            <h2 className="text-xl font-bold my-4">Management Members</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {temple.management.map((member, index) => (
                    <div key={index} className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden">
                        <div className="relative">
                            <img src={member.profile} className="w-full h-40 object-cover" alt="Member Image" />

                            <button
                                className="absolute top-2 right-2 bg-white text-black p-1 dark:bg-gray-600 dark:text-white rounded-full opacity-75 hover:opacity-100"
                                onClick={() => handleRemoveManagement(index)}
                            >
                                <FiX size={16} />
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
        </>
    );
}
