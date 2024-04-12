import { useSelector } from "react-redux";
import { Button, Card, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

export default function CreateUser() {
    const [ openModal, setOpenModal ] = useState(false);
    const { currUser } = useSelector(state => state.user);
    const [ viewPass , setViewPass ] = useState(false);
    const [ error ,  setError ] =  useState(null);
    const [ success ,  setSuccess ] =  useState(null);
    const [ roles , setRoles ] = useState()
    const [ formData , setFormdata ] = useState({
        username : '',
        email : '',
        password : '',
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
    }, [ currUser ]);
    console.log(roles);
    //handle change
    const handleChange = (e)=> {
        const { id , value }  =  e.target ; 
        setFormdata({
            ...formData,
            [id] : value,
        });
    }
    const handleSubmit = async(e, formData)=> {
        e.preventDefault();
        try {
            const  response = await fetch(
                "/api/user/create",
                {
                    method : "POST",
                    headers : { "Content-Type" : "application/json" },
                    body : JSON.stringify(formData),
                }
            );
            const data =  await response.json();

            if(!response.ok) {

            }
        }catch(err) {
            console.log(err.message);
        }
    }
    return (
        <>
        {
            currUser.isAdmin && (
                <>
                   <Card className=" w-full max-w-sm">
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Create User</h5>
                        <Button onClick={()=> setOpenModal(true)} >Create</Button>
                    </Card>
                    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} position={"left-top"}>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
                            <form className="my-3" onSubmit={handleSubmit} >
                                <div className="flex flex-col gap-3 mt-2" >
                                    <Label htmlFor="username">username</Label>
                                    <TextInput type="text" id="username" name="username" placeholder="add username" onChange={handleChange} required />
                                </div>
                                <div className="flex flex-col gap-3 mt-2" >
                                    <Label htmlFor="email">email</Label>
                                    <TextInput type="email" id="email" name="email" placeholder="company.@gmail.com" onChange={handleChange} required />
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
                                <Button onClick={handleSubmit} className="mt-4" outline>Create new user</Button>
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