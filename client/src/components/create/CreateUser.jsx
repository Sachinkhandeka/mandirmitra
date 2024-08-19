import { useSelector } from "react-redux";
import { Button, Card, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import "../../css/PhoneInputCostom.css";
import { Helmet } from  "react-helmet-async";
import Alert from "../Alert";

export default function CreateUser({ roleUpdated }) {
    const [ openModal, setOpenModal ] = useState(false);
    const { currUser } = useSelector(state => state.user);
    const [ viewPass , setViewPass ] = useState(false);
    const [ error ,  setError ] =  useState(null);
    const [ success ,  setSuccess ] =  useState(null);
    const [ roles , setRoles ] = useState([]);
    const [ formData , setFormdata ] = useState({
        username : '',
        email : '',
        password : '',
        phoneNumber : '',
        roles : [],
    });

    const  getRolesData = async()=> {
        try {
            setError(null);
            const  response = await fetch(`/api/role/get/${currUser.templeId}`);
            const data = await response.json();

            if(!response.ok) {
                return setError(data.message);
            }
            setRoles(data.roles);
        }catch(err){
            setError(err.message);
        }
    }

    useEffect(()=> {
        getRolesData();
    }, [ currUser, roleUpdated ]);
    
    //handle change
    const handleChange = (e)=> {
        const { id , value }  =  e.target ; 
        setFormdata({
            ...formData,
            [id] : value,
        });
    }
    //handle onChange  for phonenumber
    const handleOnChange = (value, { dialCode = '' }) => {
        setFormdata({
            ...formData,
            phoneNumber : `+${dialCode}${value.slice(dialCode.length)}`
        })
    };

    //handle onChange for roles
    const handleRoleSelection = (e , role)=> {
        const { checked } = e.target ; 
        if(checked) {
            setFormdata((prev)=> ({
                ...prev ,
                roles : [ ...prev.roles , role._id ]
            }));
        }else {
            setFormdata((prev)=> ({
                ...prev,
                roles : prev.roles.filter(rId => rId !== role._id)
            }));
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `/api/user/create/${currUser.templeId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );
            const data = await response.json();
    
            if (!response.ok) {
                return setError(data.message);
            }
            setSuccess(data);
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <>
        <Helmet>
            <title>Create User - Your Dashboard</title>
            <meta name="description" content="Create a new user and assign roles. Fill out the form with details such as username, email, password, and roles." />
        </Helmet>
        {
            currUser.isAdmin && (
                <>
                   <Card className="w-full max-w-sm bg-white">
                        <div className="flex items-center md:flex-col gap-4" >
                            <span className="h-20 w-20 flex items-center justify-center p-2 bg-gradient-to-r from-lime-200 to-lime-500 rounded-md" ><FiUserPlus size={30} /></span>
                            <h5 className="text-2xl text-center font-bold tracking-tight">Create User</h5>
                        </div>
                        <Button onClick={()=> setOpenModal(true)} gradientMonochrome={"lime"} className="text-white" >Create</Button>
                    </Card>
                    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} position={"left-top"}>
                    <Modal.Header className="bg-gradient-to-r from-lime-200 to-lime-500 p-4 text-2xl font-medium text-gray-900 dark:text-white" >
                        Create user with roles
                    </Modal.Header>
                    <Modal.Body>
                        <div className="space-y-6">
                            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                                { error && ( <Alert type="error" message={error} autoDismiss duration={6000} onClose={()=> setError(null)} /> ) }
                                { success && ( <Alert type="success" message={success} autoDismiss duration={6000} onClose={()=> setSuccess(null)} /> ) }
                            </div>
                            <form className="my-3" onSubmit={handleSubmit} >
                                <div className="flex flex-col gap-3 mt-2" >
                                    <Label htmlFor="username">username</Label>
                                    <TextInput type="text" id="username" name="username" placeholder="add username" onChange={handleChange} required />
                                </div>
                                <div className="flex flex-col gap-3 mt-2" >
                                    <Label htmlFor="email">email</Label>
                                    <TextInput type="email" id="email" name="email" placeholder="company.@gmail.com" onChange={handleChange} required />
                                </div>
                                <div className="flex flex-col gap-3 mt-2" >
                                <Label htmlFor="email">phoneNumber</Label>
                                    <PhoneInput
                                        country={'in'}
                                        onChange={handleOnChange}
                                        placeholder="Enter Phone Number"
                                        containerClass="custom-phone-input-container"
                                        inputClass="custom-phone-input"
                                        buttonClass="custom-dropdown-button"
                                        dropdownClass="custom-dropdown-container"
                                        searchClass="custom-search-field"
                                    />
                                </div>
                                <div className="flex flex-col gap-3 mt-2 relative" >
                                    <Label htmlFor="password" >password: </Label>
                                    <TextInput 
                                        type={`${ viewPass ? 'text' : 'password' }`} 
                                        id="password" 
                                        name="password" 
                                        placeholder="************" 
                                        onChange={handleChange} required 
                                    />
                                    <span className="absolute right-4 top-12 cursor-pointer" onClick={() => setViewPass(!viewPass)}>
                                        {viewPass ? <FaRegEyeSlash /> : <FaRegEye /> }
                                    </span>
                                </div>
                                {
                                    roles && Array.isArray(roles) && roles.length > 0 && (
                                        <div className="my-2 block">
                                            <Label value="Add Roles" />
                                            <div className="grid grid-cols-2 gap-3" >
                                                {roles.map(role => (
                                                    <div key={role._id} className="flex gap-3 mt-2 items-center" >
                                                        <Checkbox
                                                            type="checkbox"
                                                            id={role._id}
                                                            value={role.name}
                                                            onChange={(e) => handleRoleSelection(e, role)}
                                                        />
                                                        <Label htmlFor={role._id}>
                                                            {role.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                }
                                <Button onClick={handleSubmit} className="mt-4" gradientMonochrome={"lime"} outline>Create new user</Button>
                            </form>
                        </div>
                     </Modal.Body>
                 </Modal>
                </>
            )
        }
        </>
    );
}