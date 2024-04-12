import { useSelector } from "react-redux";
import { Button, Card, Label, Modal, TextInput, Select, Checkbox, Alert } from "flowbite-react";
import { useEffect, useState } from "react";

export default function CreateRoles() {
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
    },[ currUser ]);

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
                setError(data.message);
            }
            setSuccess(data);
        }catch(err) {
            setError(err.message);
        }
    }
    return (
        <>
        {
            currUser.isAdmin && (
                <>
                   <Card className=" w-full max-w-sm">
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Add Roles</h5>
                        <Button onClick={()=> setOpenModal(true)} >Add</Button>
                    </Card>
                    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)}>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add Roles</h3>
                            { error && ( <Alert color={"failure"} onDismiss={()=> setError(null)} >{ error }</Alert> ) }
                            { success && ( <Alert color={"success"} onDismiss={()=> setSuccess(null) } >{ success }</Alert> ) }
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
                                <Button onClick={handleSubmit} >Add Role</Button>
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