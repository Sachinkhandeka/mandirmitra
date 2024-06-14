import { Button, Label, Spinner, TextInput, Alert } from "flowbite-react";
import image from "../assets/temple1.webp";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaCopyright } from "react-icons/fa";
import { GiPrayer } from "react-icons/gi";
import { Helmet } from "react-helmet-async";

export default function SignupSuperAdmin() {
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
            navigate("/superadmin", {
                state: {
                    templeId: data.temple._id
                }
            });
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    }

    return (
        <div className="w-full p-10 min-h-screen" style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <Helmet>
                <title>Add Temple - MandirMitra</title>
                <meta name="description" content="Add a new temple to MandirMitra. Provide the temple's name and location to get started." />
                <meta name="keywords" content="MandirMitra, Add Temple, Temple Management, Super Admin" />
            </Helmet>
            <div className="border-2 border-blue-400 shadow-lg rounded-lg p-10 w-full max-w-[600px] mx-auto relative bg-blue-50 dark:bg-gradient-to-br from-gray-800 to-gray-400">
                <div className="absolute top-4 left-4 text-red-500 bg-white rounded-full p-2 md:p-4">
                    <GiPrayer size={30} />
                </div>
                <div className="absolute top-4 right-4 text-red-500 bg-white rounded-full p-2 md:p-4">
                    <GiPrayer size={30} />
                </div>
                {error && (<Alert color={"failure"} onDismiss={() => setError(null)} className="my-10 w-full">{error}</Alert>)}
                <h1 className="text-center text-2xl font-mono font-bold leading-8 uppercase">Add Temple</h1>
                <form className="my-10" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="name">Temple Name</Label>
                        <TextInput type="text" id="name" name="name" placeholder="add temple name" onChange={handleChange} required />
                    </div>
                    <div className="flex flex-col gap-4 mt-4">
                        <Label htmlFor="location">Temple Location</Label>
                        <TextInput type="text" id="location" name="location" placeholder="Bhuj, Kutch, Gujarat" onChange={handleChange} required />
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
                <div className="flex items-center flex-wrap gap-2 text-sm p-2">
                    <p className="whitespace-nowrap">Already have an account?</p>
                    <span className="text-blue-600 text-sm">
                        <Link to={"/signin"} className="hover:underline">Super-admin</Link>
                    </span>
                    or
                    <span className="text-blue-600 text-sm">
                        <Link to={"/user-signin"} className="hover:underline">User</Link>
                    </span>
                </div>
                <div className="p-2 flex gap-2 items-center text-black text-sm font-bold">
                    <FaCopyright size={18} />
                    <p>All copyright reserved by MandirMitra.</p>
                </div>
            </div>
        </div>
    );
}
