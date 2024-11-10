import { useState } from "react";
import { GiPrayer } from "react-icons/gi";
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
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.name || !formData.location) {
            setLoading(false);
            return setError("Please provide name and location.");
        }
        try {
            setError(null);
            const response = await fetch(
                "/api/temple/add/genInfo",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ templeData : formData })
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
    }

    return (
        <div className="relative flex flex-col gap-4 w-full md:max-w-md md:py-6 bg-white md:min-h-40 rounded-lg md:border md:border-blue-500 pt-1 p-10 text-black">
            <Helmet>
                <title>Add Temple - mandirmitra</title>
                <meta name="description" content="Add a new temple to mandirmitra. Provide the temple's name and location to get started." />
                <meta name="keywords" content="mandirmitra, MandirMitra, Add Temple, Temple Management, Super Admin" />
            </Helmet>
            <div className="relative">
                <div className="absolute hidden md:block md:top-2 md:left-2 text-red-500 bg-white rounded-full p-2">
                    <GiPrayer size={12} />
                </div>
                <div className="absolute hidden md:block md:top-2 md:right-2 text-red-500 bg-white rounded-full p-2">
                    <GiPrayer size={12} />
                </div>
                <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                    {error && ( <Alert type="error" message={error} autoDismiss duration={6000} onClose={() => setError(null)} /> )}
                </div>
                <h1 className="text-center text-2xl font-mono font-bold leading-8 uppercase">Add Temple</h1>
                <form className="my-10" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <label htmlFor="name" className="text-black">Temple Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Add temple name"
                            onChange={handleChange}
                            required
                            className="bg-gray-200 text-black placeholder-gray-500 p-2 rounded"
                        />
                    </div>
                    <div className="flex flex-col gap-4 mt-4">
                        <label htmlFor="location" className="text-black">Temple Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            placeholder="Bhuj, Kutch, Gujarat"
                            onChange={handleChange}
                            required
                            className="bg-gray-200 text-black placeholder-gray-500 p-2 rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full my-8 bg-gradient-to-r from-teal-400 to-lime-400 text-white py-2 rounded disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? <Spinner color={"blue"} /> : 'Add'}
                    </button>
                </form>
            </div>
        </div>
    );
}
