import { useSelector } from "react-redux";
import { FaAddressCard } from "react-icons/fa6";
<<<<<<< HEAD
import { Button, Card, Label, Modal, TextInput, Checkbox } from "flowbite-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";
=======
import { Button, Card, Label, Modal, TextInput, Select, Checkbox, Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
>>>>>>> 1ec6c1190f4d0e1f435a1159826a6485d909f462

export default function CreateRoles({ updated, setRoleUpdated }) {
    const [ openModal, setOpenModal ] = useState(false);
    const { currUser } = useSelector(state => state.user);
    const [ permissions , setPermissions ]  = useState({});
    const [ error , setError ] = useState(null);
    const [ success , setSuccess ] = useState(null);
    const [ formData , setFormData ] =  useState({
        name : '',
        permissions : [],
    });

    const getPermissionsData = async()=> {
        try {
            setError(null);
            setSuccess(null);

            if (!currUser || !currUser.templeId) {
                setError("Invalid user or templeId");
                return;
            }
            const response = await fetch(`/api/permission/get/${currUser.templeId.toString()}`);
            const data = await response.json();
            
            if(!response.ok) {
                return setError(data.message);
            }
            setPermissions( data.permissions );
        }catch(err) {
            setError(err.message);
        }
    }

    useEffect(()=> {
        getPermissionsData();
    },[ currUser, updated ]);

    //handleChaange  for rolle name  
    const  handleChange = (e)=> {
        setFormData({
            ...formData,
            [e.target.id] : e.target.value
        });
    }
    //handle onChange for permissions
    const handlePermissionSelection = (e , permission)=> {
        const { checked } = e.target ; 
        if(checked) {
            setFormData(prev => ({
                ...prev,
                permissions : [ ...prev.permissions , permission._id ],
            }));
        }else {
            setFormData(prev => ({
                ...prev,
                permissions : prev.permissions.filter(pId => pId !== permission._id)
            }));
        }
    }
    const handleSubmit = async(e)=> {
        e.preventDefault();
        try {
            const  response = await fetch(
                `/api/role/create/${currUser.templeId}`,
                {
                    method : "POST",
                    headers : { "Content-Type" : "application/json" },
                    body : JSON.stringify(formData),
                }
            );
            const data =  await response.json();

            if(!response.ok) {
                return setError(data.message);
            }
            setRoleUpdated(true);
            setSuccess(data);
        }catch(err) {
            setError(err.message);
        }
    }
    return (
        <>
        <Helmet>
            <title>Create Roles - Your Dashboard</title>
            <meta name="description" content="Create and assign roles with specific permissions. Fill out the form to add a new role." />
        </Helmet>
        {
            currUser.isAdmin && (
                <>
                   <Card className=" w-full max-w-sm bg-white">
                        <div className="flex items-center md:flex-col gap-4" >
                            <span className="h-20 w-20 flex items-center justify-center p-2 bg-gradient-to-r from-red-400 to-red-700 rounded-md" ><FaAddressCard size={30} /></span>
                            <h5 className="text-2xl font-bold tracking-tight">Add Roles</h5>
                        </div>
                        <Button onClick={()=> setOpenModal(true)} gradientMonochrome={"failure"} >Add</Button>
                    </Card>
                    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)}>
                    <Modal.Header className="bg-gradient-to-r from-red-400 to-red-700 p-4 text-2xl font-medium text-gray-900 dark:text-white" >
                        Add Roles
                    </Modal.Header>
                    <Modal.Body>
                        <div className="space-y-6">
<<<<<<< HEAD
                            { error && ( <Alert type="error" message={error} autoDismiss duration={6000} /> ) }
                            { success && ( <Alert type="success" message={success} autoDismiss duration={6000} /> ) }
=======
                            { error && ( <Alert color={"failure"} onDismiss={()=> setError(null)} className="my-2" >{ error }</Alert> ) }
                            { success && ( <Alert color={"success"} onDismiss={()=> setSuccess(null) } className="my-2" >{ success }</Alert> ) }
>>>>>>> 1ec6c1190f4d0e1f435a1159826a6485d909f462
                            <form onSubmit={handleSubmit} >
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="name" value="Add role name" />
                                </div>
                                <TextInput id="name" placeholder="eg. editor, creator" required onChange={handleChange} />
                            </div>
                            {permissions && Array.isArray(permissions) && permissions.length > 0 && (
                                <div className="mb-2 block">
                                    <Label value="Select your permissions" />
                                    {permissions.map(permission => (
                                        <div key={permission._id} className="flex gap-3 mt-2 items-center" >
                                            <Checkbox
                                                type="checkbox"
                                                id={permission._id}
                                                value={permission.permissionName}
                                                onChange={(e) => handlePermissionSelection(e, permission)}
                                            />
                                            <Label htmlFor={permission._id}>
                                                {permission.permissionName} - {permission.actions.join(', ')}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="w-full mt-3 ">
                                <Button onClick={handleSubmit} gradientMonochrome={"failure"} outline >Add Role</Button>
                            </div>
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