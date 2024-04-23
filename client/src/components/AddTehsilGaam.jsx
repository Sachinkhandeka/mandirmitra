import { FloatingLabel, Button, Alert, Spinner } from "flowbite-react";
import { useState } from "react";

export default function AddTehsilGaam() {
    const [ error ,  setError ] =  useState(null);
    const [ success , setSuccess ] =  useState(null);
    const [ loading , setLoading ] = useState(false);
    const [ formData , setFormData ] = useState({
        country  : '',
        state : '',
        district  : '',
        tehsil : '',
        village : '',
    });
    const [ showState , setShowState ] = useState(false);
    const [ showDistrict , setShowDistrict ] = useState(false);
    const [ showTehsil , setShowTehsil ] = useState(false);
    const [ showVillage , setShowVillage ] =useState(false);

    //handle input change
    const handleChange = (e)=> {
        const{ id , value } = e.target ; 
        setFormData({
            ...formData,
            [id] : value.toLowerCase(), 
        });

        switch(id) {
            case "country" : id === "country",
            setShowState(true)
            break;
            case "state" : id === "state",
            setShowDistrict(true)
            break;
            case "district" :  id ===  "district",
            setShowTehsil(true)
            break;
            case "tehsil" : id === "tehsil",
            setShowVillage(true)
            break;
        }
        
    }
    //function to add location 
    const handleSubmit = async(e)=> {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const response = await fetch(
                "/api/location/add",
                {
                    method : "POST",
                    headers : { "Content-Type" : "application/json" },
                    body : JSON.stringify(formData),
                }
            );
            const  data =  await  response.json();

            if(!response.ok) {
                setLoading(false);
                setError(data.message);
                return ; 
            }
            setSuccess(data.message);
            setLoading(false);
        }catch(err) {
            setLoading(false);
            setError(err.message)
        }
    }

    return (
        <div className="w-full md:max-w-[50%] mt-10 border-2 rounded-lg dark:border-gray-500 dark:bg-gray-800 p-4" >
            <h1 className="text-xl font-mono uppercase text-center" >Add Location</h1>
            { error && ( <Alert onDismiss={()=> setError(null)} color={"failure"} >{ error }</Alert> ) }
            { success && ( <Alert onDismiss={()=> setSuccess(null)} color={"success"} >{ success }</Alert> ) }
            <form onSubmit={handleSubmit} >
                <div className="grid grid-cols-1  md:grid-cols-2 justify-stretch gap-10 p-4" >
                    <div className="flex flex-col gap-2 mt-1" >
                        <FloatingLabel id="country" name="country" label="Country" variant="standard" onChange={handleChange} />
                    </div>
                    { showState && (
                        <div className="flex flex-col gap-2 mt-1" >
                            <FloatingLabel id="state" name="state" label="State" variant="standard" onChange={handleChange} />
                        </div>
                    ) }
                    { showDistrict && (
                        <div className="flex flex-col gap-2 mt-1" >
                            <FloatingLabel id="district" name="district" label="District" variant="standard" onChange={handleChange} />
                        </div>
                    ) }
                    { showTehsil && (
                        <div className="flex flex-col gap-2 mt-1" >
                            <FloatingLabel id="tehsil" name="tehsil" label="Tehsil" variant="standard" onChange={handleChange} />
                        </div>
                    ) }
                    { showVillage && (
                        <div className="flex flex-col gap-2 mt-1" >
                            <FloatingLabel id="village" name="village" label="Village" variant="standard" onChange={handleChange} />
                        </div>
                    ) }
                </div>
                <Button gradientDuoTone={"pinkToOrange"} outline onClick={handleSubmit} disabled={loading} >
                    {loading ? <Spinner color={"pink"} /> :'Add'}
                </Button>
            </form>
        </div>
    );
}