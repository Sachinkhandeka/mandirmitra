import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Spinner } from "flowbite-react";
import Alert from "../components/Alert";

export default function SignupSuperAdmin({ setShowComponent }) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.name || !formData.location) {
            setLoading(false);
            return setError("Please provide the temple's name and location.");
        }

        try {
            setError(null);
            const response = await fetch(
                "/api/temple/add/genInfo",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ templeData: formData })
                }
            );
            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                setError(data.message);
                return;
            }
            setShowComponent("createSuperAdmin");
            localStorage.setItem("templeId", data.temple._id);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full bg-white md:min-h-40 rounded-lg px-6 md:px-0 py-4">
            <Helmet>
                <title>Add Temple - MandirMitra</title>
                <meta name="description" content="Add a new temple to MandirMitra. Provide the temple's name and location to get started." />
                <meta name="keywords" content="MandirMitra, Add Temple, Temple Management, Super Admin" />
            </Helmet>

            {/* Alert Notification */}
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {error && (
                    <Alert
                        type="error"
                        message={error}
                        autoDismiss
                        duration={6000}
                        onClose={() => setError(null)}
                    />
                )}
            </div>

            {/* Title */}
            <h1 className="text-center text-3xl font-bold text-gray-800 uppercase tracking-wide">
                Add Temple
            </h1>
            <p className="text-center text-gray-600 text-sm leading-relaxed">
                Add your temple to MandirMitra to begin managing and sharing its spiritual legacy.
            </p>

            {/* Form */}
            <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
                {/* Temple Name */}
                <div className="flex flex-col">
                    <label
                        htmlFor="name"
                        className="text-gray-700 font-medium text-sm mb-2"
                    >
                        Temple Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter the temple's name"
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition duration-200"
                    />
                </div>

                {/* Temple Location */}
                <div className="flex flex-col">
                    <label
                        htmlFor="location"
                        className="text-gray-700 font-medium text-sm mb-2"
                    >
                        Temple Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="e.g., Bhuj, Kutch, Gujarat"
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition duration-200"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none"
                    disabled={loading}
                >
                    {loading ? (
                        <Spinner size="md" color="white" />
                    ) : (
                        'Add Temple'
                    )}
                </button>
            </form>
        </div>
    );
}
