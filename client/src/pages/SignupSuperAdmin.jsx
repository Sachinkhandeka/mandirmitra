import { Button, Label, Spinner, TextInput, Alert } from "flowbite-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GiPrayer } from "react-icons/gi";
import { Helmet } from "react-helmet-async";

export default function SignupSuperAdmin({ setShowComponent }) {
    const navigate = useNavigate();
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
                "/api/temple/add",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
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
                <title>Add Temple - MandirMitra</title>
                <meta name="description" content="Add a new temple to MandirMitra. Provide the temple's name and location to get started." />
                <meta name="keywords" content="MandirMitra, Add Temple, Temple Management, Super Admin" />
            </Helmet>
            <div className="relative">
                <div className="absolute hidden md:block md:top-2 md:left-2 text-red-500 bg-white rounded-full p-2">
                    <GiPrayer size={12} />
                </div>
                <div className="absolute hidden md:block md:top-2 md:right-2 text-red-500 bg-white rounded-full p-2">
                    <GiPrayer size={12} />
                </div>
                {error && (<Alert color={"failure"} onDismiss={() => setError(null)} className="my-10 w-full">{error}</Alert>)}
                <h1 className="text-center text-2xl font-mono font-bold leading-8 uppercase">Add Temple</h1>
                <form className="my-10" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="name">Temple Name</Label>
                        <TextInput type="text" id="name" name="name" placeholder="add temple name" onChange={handleChange} required className="bg-gray-200 text-black placeholder-gray-500" />
                    </div>
                    <div className="flex flex-col gap-4 mt-4">
                        <Label htmlFor="location">Temple Location</Label>
                        <TextInput type="text" id="location" name="location" placeholder="Bhuj, Kutch, Gujarat" onChange={handleChange} required className="bg-gray-200 text-black placeholder-gray-500" />
                    </div>
                    <Button
                        onClick={handleSubmit}
                        gradientDuoTone={"tealToLime"}
                        outline
                        className="w-full my-8"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <Spinner /> : 'Add'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
