import { useSelector } from "react-redux";
import { FaAddressCard } from "react-icons/fa6";
import { Button, Card, Label, Modal, TextInput, Checkbox, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";

export default function CreateRoles({ updated, setRoleUpdated }) {
    const navigate = useNavigate();
    const [ openModal, setOpenModal ] = useState(false);
    const { currUser } = useSelector(state => state.user);
    const [ permissions , setPermissions ]  = useState({});
    const [ alert, setAlert ] = useState({ type : "", message : "" });
    const [ loading, setLoading ] = useState(false);
    const [ formData , setFormData ] =  useState({
        name : '',
        permissions : [],
    });

    const getPermissionsData = async()=> {
        try {
            setLoading(true);
            setAlert({ type : "", message : "" });

            if (!currUser || !currUser.templeId) {
                setAlert({ type : "error", message : "Invalid user or templeId" });
                setLoading(false);
                return;
            }
            const data = await fetchWithAuth(
                `/api/permission/get/${currUser.templeId.toString()}`,
                {},
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setPermissions( data.permissions );
                setLoading(false);
            }
        }catch(err) {
            setAlert({ type : "error", message : err.message });
            setLoading(false);
            return;
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
        setLoading(true);
        setAlert({ type : "", message : "" });
        try {
            const data = await fetchWithAuth(
                `/api/role/create/${currUser.templeId}`,
                {
                    method : "POST",
                    headers : { "Content-Type" : "application/json" },
                    body : JSON.stringify(formData),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            console.log(data);
            if(data){ 
                setRoleUpdated(true);
                setAlert({ type : "success", message : data });
                setLoading(false);
            }
        }catch(err) {
            setLoading(false);
            setAlert({ type : "error", message : err.message });
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
                    <div className="p-0.5 bg-gradient-to-r from-red-400 to-red-700 rounded-lg">
                        <Card className="w-full h-full bg-white">
                            <div className="flex items-center md:flex-col gap-4" >
                                <span className="h-20 w-20 flex items-center justify-center p-2 bg-gradient-to-r from-red-400 to-red-700 rounded-md" ><FaAddressCard size={30} /></span>
                                <h5 className="text-2xl font-bold tracking-tight">Add Roles</h5>
                            </div>
                            <Button onClick={()=> setOpenModal(true)} gradientMonochrome={"failure"} >Add</Button>
                        </Card>
                    </div>
                    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)}>
                    <Modal.Header className="bg-gradient-to-r from-red-400 to-red-700 p-4 text-2xl font-medium text-gray-900 dark:text-white" >
                        Add Roles
                    </Modal.Header>
                    <Modal.Body>
                        <div className="space-y-6">
                            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                                {alert.message && (
                                    <Alert 
                                        type={alert.type}
                                        message={alert.message}
                                        autoDismiss
                                        duration={6000}
                                        onClose={()=> setAlert({ type : "", message : "" })}
                                    />
                                )}
                            </div>
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
                                <Button 
                                    onClick={handleSubmit} 
                                    gradientMonochrome={"failure"} 
                                    outline 
                                    disabled={loading}
                                >
                                    { loading ? <Spinner color={"failure"} /> :  'Add Role' }
                                </Button>
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