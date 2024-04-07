import { Modal, Button, Label,TextInput, Alert, Spinner } from "flowbite-react";
import { FaPencil } from "react-icons/fa6";
import { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useDispatch , useSelector } from "react-redux";
import { signinStart, signinSuccess, signinFailure, resetError } from "../redux/user/userSlice";

export default function DashProfile() {
    const dispatch = useDispatch();
    const [ showModal , setShowModal ] = useState(false);
    const [ viewPass , setViewPass ] = useState(false);
    const { currUser, loading , error } = useSelector(state => state.user);
    const [ formData , setFormData ] = useState({
        id :  currUser._id,
        username : currUser.username,
        email : currUser.email,
        password : "",
    });

    console.log(formData);
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
        try {
            const response =  await  fetch(
                "/api/superadmin/edit",
                {
                    method : "PUT",
                    headers : { "Content-Type" : "application/json" },
                    body : JSON.stringify(formData),
                }
            );
            const  data = await response.json();

            if(!response.ok) {
                console.log(data.message);
                dispatch(signinFailure(data.message));
                return ;
            }
            dispatch(signinSuccess(data));
        } catch(err) {
            dispatch(signinFailure(err.message));
        }
    }
    return (
        <div className="w-full min-w-[375px]" >
            { currUser && (
                <div className="w-full" >
                    <div className="w-full bg-gray-400 h-16 relative" >
                        <div className="h-14 w-14 absolute bottom-[-10px] left-4 rounded-full cursor-pointer" >
                            <img 
                                src={currUser.profilePicture} 
                                alt="profile_Image" 
                                className=" h-full w-full rounded-full object-cover border-2 border-white" 
                            />
                        </div>
                    </div>
                    <div className="mt-10 md:w-20" >
                        <h1 className="text-2xl font-mono font-bold pl-4" >{  currUser.username }</h1>
                        <p className="text-sm pl-4" >{ currUser.email }</p>
                    </div>
                    <div className="p-4 md:absolute md:right-8 md:top-28 rounded-full w-14 h-14 hover:bg-gray-300 cursor-pointer" >
                        <FaPencil size={20} onClick={()=> setShowModal(true)} />
                    </div>
                    <Modal show={showModal} onClose={() => setShowModal(false)}>
                       <Modal.Header>Edit Details</Modal.Header>
                       <Modal.Body>
                       { error && ( <Alert color={"failure"} onDismiss={() => dispatch(resetError())}>{ error }</Alert> ) }
                         <div className="space-y-6">
                            <form className="p-4" onSubmit={handleSubmit} >
                                <div className="flex flex-col gap-4 my-4" >
                                    <Label htmlFor="username" >username: </Label>
                                    <TextInput 
                                        type="text" 
                                        id="username" 
                                        name="username" 
                                        value={formData.username} 
                                        onChange={handleChange} required />
                                </div>
                                <div className="flex flex-col gap-4 my-4" >
                                    <Label htmlFor="email" >email: </Label>
                                    <TextInput 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} required />
                                </div>
                                <div className="flex flex-col gap-4 my-4 relative" >
                                    <Label htmlFor="password" >password: </Label>
                                    <TextInput 
                                        type={`${ viewPass ? 'text' : 'password' }`} 
                                        id="password" 
                                        name="password" 
                                        placeholder={'**************'} 
                                        onChange={handleChange} required 
                                    />
                                    <span className="absolute right-4 top-12 cursor-pointer" onClick={() => setViewPass(!viewPass)}>
                                        {viewPass ? <FaRegEye /> : <FaRegEyeSlash /> }
                                    </span>
                                </div>
                            </form>
                         </div>
                       </Modal.Body>
                       <Modal.Footer>
                            <Button onClick={handleSubmit} disabled={loading}>
                                {loading ? <Spinner /> :'Save'}
                            </Button>
                            <Button color="gray" onClick={() => setShowModal(false)}>
                                Decline
                            </Button>
                       </Modal.Footer>
                     </Modal>
                </div>
            ) }
        </div>
    );
}