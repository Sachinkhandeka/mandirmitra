import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaOm } from "react-icons/fa6";
import { FaSuperpowers, FaCopyright } from "react-icons/fa";
import { Button, Label, TextInput } from "flowbite-react";

export default function CreateSuperAdmin() {
    const location = useLocation();
    const navigate = useNavigate("/");
    const { templeId } = location.state; 
    
    const [ formData , setFormData ] = useState({
        templeId : templeId,
        username : "",
        email : "",
        password : "",
    });
    const [ error , setError ] = useState(null);

    //handleChange - formData
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
            const response  = await fetch(
                "/api/superadmin/create",
                {
                    method : "POST",
                    headers : { "Content-Type" : "application/json" },
                    body : JSON.stringify(formData),
                }
            );
            const data = await response.json();

            if(!response.ok) {
                setError(data.message);
                return;
            }
            navigate("/", {
                state : {
                    user : data.user,
                    templeId : data.templeId,
                }
            });
        }catch(err){
            setError(err.message);
        }
    }
    return(
        <div className="w-full p-8 relative" >
            <div className="absolute top-4 left-4 text-red-500" >
                <FaOm size={26} />
            </div>
            <div className="absolute top-4 right-4 text-red-500" >
                <FaOm size={26} />
            </div>
            <div className="mx-auto p-4 border border-gray-200 shadow-lg rounded-lg w-full max-w-[600px] my-10" >
                <div className="flex whitespace-nowrap gap-4 my-4 items-center justify-center" >
                    <FaSuperpowers size={28} />
                    <h1 className="text-2xl font-mono font-bold uppercase" >Create Super Admin</h1>
                    <FaSuperpowers size={28} />
                </div>
                <form className="p-4" onSubmit={handleSubmit} >
                    <div className="flex flex-col gap-4 my-4" >
                        <Label htmlFor="username" >username: </Label>
                        <TextInput type="text" id="username" name="username" placeholder="eg. superAdmin_001" onChange={handleChange} required />
                    </div>
                    <div className="flex flex-col gap-4 my-4" >
                        <Label htmlFor="email" >email: </Label>
                        <TextInput type="email" id="email" name="email" placeholder="eg. superAdmin@gmail.com" onChange={handleChange} required />
                    </div>
                    <div className="flex flex-col gap-4 my-4" >
                        <Label htmlFor="password" >password: </Label>
                        <TextInput type="password" id="password" name="password" placeholder="************" onChange={handleChange} required />
                    </div>
                    <Button 
                        onClick={handleSubmit} 
                        gradientDuoTone={"purpleToBlue"} 
                        outline
                        className="w-full my-8"
                        type="submit"
                    >
                        Add Super Admin
                    </Button>
                </form>
                <div className="p-4 flex gap-2 items-center text-gray-500 text-sm" >
                    <FaCopyright size={18} />
                    <p>All copyright reserved by prayasi-Temple.</p>
                </div>
            </div>
        </div>
    );
}