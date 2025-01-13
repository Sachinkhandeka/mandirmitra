import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Alert from "../Alert";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";
import TempleAdminControls from "../admin-temple-components/TempleAdminControls";

export default function DashTempleInsights() {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const [temple, setTemple] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });

    // Function to get temple data
    const getTempleData = async () => {
        try {
            setLoading(true);
            setAlert({ type: "", message: "" });
            const data = await fetchWithAuth(
                `/api/temple/get/${currUser.templeId}`,
                {},
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if (data) {
                setTemple(data.temple);
            }
        } catch (err) {
            setAlert({ type: "error", message: err.message });
        }
    };

    useEffect(() => {
        getTempleData();
    }, [currUser]);

    return (
        <>
            {currUser.isAdmin && (
                <>
                    <TempleAdminControls temple={temple} setTemple={setTemple} setAlert={setAlert} />
                    {/* Alert Message */}
                    <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                        {alert && alert.message && (
                            <Alert
                                type={alert.type}
                                message={alert.message}
                                autoDismiss
                                onClose={() => setAlert(null)}
                            />
                        )}
                    </div>
                </>
            )}
        </>
    );
}
