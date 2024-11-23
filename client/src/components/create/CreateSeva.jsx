import { Button, FloatingLabel, Spinner } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";

export default function CreateSeva({ setSevaUpdated }) {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const [seva, setSeva] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type : "", message : "" });

    const addSeva = async(e)=> {
        e.preventDefault();
        setLoading(false);
        setAlert({ type : "", message : "" });
        try {
            const data = await fetchWithAuth(
                `/api/seva/create/${currUser.templeId}`,
                { 
                    method : "POST",
                    headers : { "content-type" : "application/json" },
                    body : JSON.stringify({ seva }),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate   
            );
            if(data) {
                setAlert({ type : "success", message : data.message });
                setLoading(false);
                setSevaUpdated(true);
                setSeva('');
            }
        }catch(err) {
            setLoading(false);
            setAlert({ type : "error", message : err.message});
        };
    }

    return (
        <>
            <Helmet>
                <title>Create Seva - Your Dashboard</title>
                <meta name="description" content="Add a new seva to your temple's offerings. Fill out the form to add a seva." />
            </Helmet>
            <div className="flex-1 border-2 rounded-lg dark:border-gray-500 dark:bg-gray-800 p-4" >
                <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                    {alert && alert.message && (
                        <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                    )}
                </div>
                <h2 className="text-xl font-mono uppercase text-center" >Add Seva</h2>
                <form onSubmit={addSeva}>
                    <div className="flex flex-col gap-2 mt-4" >
                        <FloatingLabel id="seva" name="seva" label="Seva Name" variant="standard" value={seva} onChange={(e)=> setSeva(e.target.value)} required />
                    </div>
                    <div>
                        <Button 
                            onClick={addSeva} 
                            gradientMonochrome={"lime"} 
                            outline 
                            className="mt-4"
                            disabled={loading} 
                        >
                            {loading ? <Spinner color={"success"} /> : 'Add Seva'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}