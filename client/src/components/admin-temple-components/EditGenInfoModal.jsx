import { Modal, Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";
import { useNavigate } from "react-router-dom";

export default function EditGenInfoModal({
    showEditModal,
    setShowEditModal,
    setLoading,
    temple,
    setTemple,
    setAlert
}) {
    const navigate = useNavigate();
    const [generalInfo, setGeneralInfo] = useState({
        templeName: "",
        alternateName: "",
        address: "",
        founded: 0,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Populate form fields with temple data
    useEffect(() => {
        if (temple) {
            setGeneralInfo({
                templeName: temple.name || "",
                alternateName: temple.alternateName || "",
                address: temple.location || "",
                founded: temple.foundedYear || 0,
            });
        }
    }, [temple]);

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setGeneralInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async () => {
        setAlert({ type: "", message: "" });
        setLoading(true);
        setIsSubmitting(true);

        try {
            const updatedInfo = {
                name: generalInfo.templeName,
                alternateName: generalInfo.alternateName,
                location: generalInfo.address,
                foundedYear: generalInfo.founded,
            };

            const data = await fetchWithAuth(
                `/api/temple/edit/${temple._id}/genInfo`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ templeData: updatedInfo }),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setIsSubmitting,
                setAlert,
                navigate
            );

            if (data) {
                setAlert({ type: "success", message: "Information saved successfully!" });
                setTemple((prevTemple) => ({ ...prevTemple, ...updatedInfo }));
                setShowEditModal(false);
            }
        } catch (error) {
            setAlert({ type: "error", message: "Error saving information. Please try again." });
        } finally {
            setLoading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={showEditModal} dismissible onClose={() => setShowEditModal(false)}>
            <Modal.Header>Edit Temple Info</Modal.Header>
            <Modal.Body>
                {/* Temple Name */}
                <div className="mb-4">
                    <label
                        htmlFor="templeName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Temple Name
                    </label>
                    <input
                        id="templeName"
                        name="templeName"
                        value={generalInfo.templeName}
                        onChange={handleChange}
                        placeholder="Enter temple name"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        required
                    />
                </div>

                {/* Alternate Name */}
                <div className="mb-4">
                    <label
                        htmlFor="alternateName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Alternate Name
                    </label>
                    <input
                        id="alternateName"
                        name="alternateName"
                        value={generalInfo.alternateName}
                        onChange={handleChange}
                        placeholder="Enter alternate name (optional)"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    />
                </div>

                {/* Address */}
                <div className="mb-4">
                    <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Address
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        value={generalInfo.address}
                        onChange={handleChange}
                        placeholder="Enter temple address"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        rows={3}
                        required
                    />
                </div>

                {/* Founded Year */}
                <div className="mb-4">
                    <label
                        htmlFor="founded"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Founded Year
                    </label>
                    <input
                        id="founded"
                        name="founded"
                        type="number"
                        value={generalInfo.founded}
                        onChange={handleChange}
                        placeholder="Enter the year temple was founded"
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-6 py-2 font-semibold rounded-lg shadow-md transition-colors
                        ${isSubmitting ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600"}
                    `}
                >
                    {
                        isSubmitting ?
                        <Spinner color="failure" size="sm" aria-label="Loading spinner" /> : 
                        "Save Changes"
                    }
                </button>
                <Button
                    color="gray"
                    onClick={() => setShowEditModal(false)}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
