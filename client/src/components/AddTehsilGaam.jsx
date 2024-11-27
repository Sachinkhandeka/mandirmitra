import { FloatingLabel, Button, Spinner } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../utilityFunx";

export default function AddTehsilGaam({ setLocationAdded }) {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const [alert, setAlert] = useState({ type : "", message : "" });
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        country: '',
        state: '',
        district: '',
        tehsil: '',
        village: '',
    });
    const [showState, setShowState] = useState(false);
    const [showDistrict, setShowDistrict] = useState(false);
    const [showTehsil, setShowTehsil] = useState(false);
    const [showVillage, setShowVillage] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value.toLowerCase(),
        });

        switch (id) {
            case "country":
                setShowState(true);
                break;
            case "state":
                setShowDistrict(true);
                break;
            case "district":
                setShowTehsil(true);
                break;
            case "tehsil":
                setShowVillage(true);
                break;
            default:
                break;
        }
    }

    // Function to add location
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setAlert({ type : "", message : "" });

            const data = await fetchWithAuth(
                `/api/location/add/${currUser.templeId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setAlert({ type : "success", message : data.message });
                setLocationAdded(true);
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            setAlert({ type : "error", message : err.message });
        }
    }

    return (
        <section className="add-tehsil-gaam flex-1">
            <Helmet>
                <title>Add Country, State, Disstrict, Tehsil And Village - MandirMitra</title>
                <meta name="description" content="Add country, state, district, tehsil and village information for location." />
            </Helmet>

            <div className="border-2 rounded-lg dark:border-gray-500 dark:bg-gray-800 p-4">
                <h1 className="text-xl font-mono uppercase text-center">Add Location</h1>
                <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                    {alert && alert.message && (
                        <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                    )}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 justify-stretch gap-10 p-4">
                        <div className="flex flex-col gap-2 mt-1">
                            <FloatingLabel id="country" name="country" label="Country" variant="standard" onChange={handleChange} required />
                        </div>
                        {showState && (
                            <div className="flex flex-col gap-2 mt-1">
                                <FloatingLabel id="state" name="state" label="State" variant="standard" onChange={handleChange}  required/>
                            </div>
                        )}
                        {showDistrict && (
                            <div className="flex flex-col gap-2 mt-1">
                                <FloatingLabel id="district" name="district" label="District" variant="standard" onChange={handleChange} required />
                            </div>
                        )}
                        {showTehsil && (
                            <div className="flex flex-col gap-2 mt-1">
                                <FloatingLabel id="tehsil" name="tehsil" label="Tehsil" variant="standard" onChange={handleChange} required />
                            </div>
                        )}
                        {showVillage && (
                            <div className="flex flex-col gap-2 mt-1">
                                <FloatingLabel id="village" name="village" label="Village" variant="standard" onChange={handleChange} required />
                            </div>
                        )}
                    </div>
                    <Button gradientDuoTone={"pinkToOrange"} outline onClick={handleSubmit} disabled={loading}>
                        {loading ? <Spinner color={"pink"} /> : 'Add'}
                    </Button>
                </form>
            </div>
        </section>
    );
}
