<<<<<<< HEAD
import { Button, FloatingLabel, Spinner } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";
=======
import { Alert, Button, FloatingLabel, Spinner } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
>>>>>>> 1ec6c1190f4d0e1f435a1159826a6485d909f462

export default function CreateSeva({ setSevaUpdated }) {
    const { currUser } = useSelector(state => state.user);
    const [seva, setSeva] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const addSeva = async(e)=> {
        e.preventDefault();
        setLoading(false);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch(
                `/api/seva/create/${currUser.templeId}`,
                { 
                    method : "POST",
                    headers : { "content-type" : "application/json" },
                    body : JSON.stringify({ seva }),
                }
            );
            const data = await response.json();

            if(!response.ok) {
                setLoading(false); 
                return setError(data.messsage);
            }
            setSuccess(data.message);
            setLoading(false);
            setSevaUpdated(true);
            setSeva('');
        }catch(err) {
            setLoading(false);
            setError(err.message);
        };
    }

    return (
        <>
            <Helmet>
                <title>Create Seva - Your Dashboard</title>
                <meta name="description" content="Add a new seva to your temple's offerings. Fill out the form to add a seva." />
            </Helmet>
            <div className="flex-1 border-2 rounded-lg dark:border-gray-500 dark:bg-gray-800 p-4" >
<<<<<<< HEAD
                { error && ( <Alert type="error" message={error} autoDismiss duration={6000} /> ) }
                { success && ( <Alert type="success" message={success} autoDismiss duration={6000} /> ) }  
=======
                { error && ( <Alert onDismiss={()=> setError(null)} color={"failure"} >{ error }</Alert> ) }
                { success && ( <Alert onDismiss={()=> setSuccess(null)} color={"success"} >{ success }</Alert> ) }  
>>>>>>> 1ec6c1190f4d0e1f435a1159826a6485d909f462
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