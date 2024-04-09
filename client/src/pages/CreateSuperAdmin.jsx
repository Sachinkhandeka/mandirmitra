import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaOm } from "react-icons/fa6";
import { FaSuperpowers, FaCopyright, FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { Button, Label, TextInput , Spinner, Alert } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux"
import { signinStart, signinSuccess, signinFailure, resetError } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function CreateSuperAdmin() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch =  useDispatch();
    const { loading , error } = useSelector(state => state.user);
    const { templeId } = location.state || {};

    //if not of user and TempleId
    useEffect(()=>{
      if(!templeId ) {
           navigate("/signup");
      }
    },[templeId, navigate]);
    
    const [ formData , setFormData ] = useState({
        templeId : templeId,
        username : "",
        email : "",
        password : "",
    });
    const [ viewPass , setViewPass ] = useState(false);

    //handleChange - formData
    const handleChange = (e)=> {
        setFormData({
            ...formData,
            [e.target.id] : e.target.value.trim(),
        });
    }

    const handleSubmit = async(e)=> {
        e.preventDefault();
        dispatch(signinStart());
        if(!formData.templeId) {
            return dispatch(signinFailure("Cannot create super admin without templeId"));
        }
        if( !formData.username || !formData.email || !formData.password ) {
            return dispatch(signinFailure("Please fill out all the fields"));
        }
        try{
            dispatch(signinStart());
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
                dispatch(signinFailure(data.mmessage));
                return;
            }
            dispatch(signinSuccess(data.currUser));
            navigate("/");
        }catch(err){
            dispatch(signinFailure(err.message));
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
            <div 
              className="mx-auto p-4 border border-gray-200 shadow-lg rounded-lg w-full max-w-[600px] my-10"  >
                { error && ( <Alert color={"failure"} onDismiss={() => dispatch(resetError())}>{ error }</Alert> ) }
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
                    <div className="flex flex-col gap-4 my-4 relative" >
                        <Label htmlFor="password" >password: </Label>
                        <TextInput 
                            type={`${ viewPass ? 'text' : 'password' }`} 
                            id="password" 
                            name="password" 
                            placeholder="************" 
                            onChange={handleChange} required 
                        />
                        <span className="absolute right-4 top-12 cursor-pointer" onClick={() => setViewPass(!viewPass)}>
                                {viewPass ? <FaRegEye /> : <FaRegEyeSlash /> }
                        </span>
                    </div>
                    <Button 
                        onClick={handleSubmit} 
                        gradientDuoTone={"purpleToBlue"} 
                        outline
                        className="w-full my-8"
                        type="submit"
                        disabled={loading}
                    >
                        { loading ? <Spinner /> : 'Add Super Admin'}
                    </Button>
                    <OAuth templeId={templeId} />
                </form>
                <div className="flex items-center flex-wrap gap-2 text-sm p-2" >
                    <p className="whitespace-nowrap" >Already have account ?</p>
                    <span className="text-blue-600 text-sm" >
                        <Link to={"/signin"} className="hover:underline" >Super-admin</Link>
                    </span>
                </div>
                <div className="p-2 flex gap-2 items-center text-gray-500 text-sm" >
                    <FaCopyright size={18} />
                    <p>All copyright reserved by PrayasiTrack.</p>
                </div>
            </div>
        </div>
    );
}