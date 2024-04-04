import { Button, Label, TextInput } from "flowbite-react";
import image from "../assets/temple1.webp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCopyright } from "react-icons/fa";
import { GiPrayer } from "react-icons/gi";

export default function Signup() {
    const navigate = useNavigate();
    const [ error , setError ] = useState(null);
    const [ formData , setFormData ] = useState({
        name : '',
        location : '',
    });

    const handleChange = (e)=> {
        setFormData({
            ...formData,
            [e.target.id] : e.target.value,
        });
    }

    const handleSubmit = async(e)=> {
        e.preventDefault();
        try{
            setError(null);
            const response = await fetch(
                "/api/temple/add",
                {
                    method : "POST",
                    headers :  { "Content-Type" : "application/json" },
                    body : JSON.stringify(formData) 
                }
            );
            const data = await response.json();

            if(!response.ok) {
                setError(data.message);
                return; 
            }
            navigate("/superadmin", {
                state : {
                    templeId : data.temple._id
                }
            });
        } catch(err) {
            setError(err.message);
        }
    }
    return(
        <div className="w-full p-10 min-h-screen" style={{backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}} >
            <div className="border-2 border-gray-200 shadow-lg rounded-lg p-10 w-full max-w-[600px] mx-auto relative" >
                <div className="absolute top-4 left-4 text-red-500 bg-white rounded-full p-4" >
                    <GiPrayer size={30} />
                </div>
                <div className="absolute top-4 right-4 text-red-500 bg-white rounded-full p-4" >
                    <GiPrayer size={30} />
                </div>
                {error && (<Alert color={"failure"} onDismiss={() => setError(null)} className="my-4 mx-auto" >{error}</Alert>)}
                <h1 className="text-center text-2xl font-mono font-bold leading-8 uppercase" >Add Temple</h1>
                <form className="my-10" onSubmit={handleSubmit} >
                    <div className="flex flex-col gap-4" >
                        <Label htmlFor="name">Temple Name</Label>
                        <TextInput type="text" id="name" name="name" placeholder="add temple name" onChange={handleChange} required />
                    </div>
                    <div className="flex flex-col gap-4 mt-4" >
                        <Label htmlFor="location">Temple Location</Label>
                        <TextInput type="text" id="location" name="location" placeholder="Bhuj, Kutch, Gujarat" onChange={handleChange} required />
                    </div>
                    <Button 
                        onClick={handleSubmit} 
                        gradientDuoTone={"tealToLime"} 
                        outline
                        className="w-full my-8"
                        type="submit"
                    >
                        Add
                    </Button>
                </form>
                <div className="p-4 flex gap-2 items-center text-black text-sm font-bold" >
                    <FaCopyright size={18} />
                    <p>All copyright reserved by prayasi-Temple.</p>
                </div>
            </div>
        </div>
    );
}