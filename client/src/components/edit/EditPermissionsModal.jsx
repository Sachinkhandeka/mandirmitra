import { Button, Modal, Label , Select, Checkbox, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";

export default  function EditPermissionsModal({ showModal , setShowModal , setAlert, permissionData , setPermissionUpdated }) {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const [ loading ,  setLoading ] =  useState(false);
    const [ isPermissionUpdated , setIsPermissionUpdate ] = useState(false);
    const [ formData , setFormData ] = useState({
        permissionName : 'donation-creator',
        actions : [],
    });
    
    useEffect(()=>{
        if(permissionData && permissionData.permissionName !== undefined  && permissionData.actions !== undefined)  {
            setFormData({
                permissionName : permissionData.permissionName,
                actions : permissionData.actions
            });
        }
    },[permissionData]);

    const handleChange = (e)=> {
        const { id, value, checked } = e.target;

        if (id === "permissionName") {
            setFormData({
                ...formData,
                permissionName: value
            });
        } else {
            if (checked) {
                setFormData({
                    ...formData,
                    actions: [...formData.actions, value]
                });
            } else {
                setFormData({
                    ...formData,
                    actions: formData.actions.filter(action => action !== value)
                });
            }
        }
        setIsPermissionUpdate(true);
    }
    
    //function to update permission
    const handleUpdate = async(e)=> {
        e.preventDefault();
        if(!isPermissionUpdated) {
            setLoading(false);
           return setAlert({ type : "error", message : "Changes not detected to update." });
        }
        try {
            setLoading(true);
            setAlert({ type : "", message : "" });
            const data = await fetchWithAuth(
                `/api/permission/edit/${currUser.templeId}/${permissionData._id}`,
                {
                    method : "PUT",
                    headers : { "Content-Type" : "application/json" },
                    body : JSON.stringify(formData),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setLoading(false);
                setPermissionUpdated(true);
                setShowModal(false);
                setIsPermissionUpdate(false);
                setAlert({ type : "success", message : "Permission updated successfully." });
            }
        } catch(err) {
            setAlert({ type : "error", message : err.message });
        }
    }
    return (
        <>
            <Helmet>
                <title>Edit Permission - Temple Management</title>
                <meta name="description" content="Edit a permission record in the temple management system. Update permission details like permission name and actions." />
            </Helmet>
            <Modal show={showModal} dismissible onClose={()=> setShowModal(false)} size={"md"} position={"top-right"} >
                <Modal.Header>
                    <p>Edit Permission</p>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div >
                            <div className="mb-2 block">
                                <Label htmlFor="permissionName" value="Add permission name" />
                            </div>
                            <Select id="permissionName" required onChange={handleChange} value={formData.permissionName} >
                                <option value="select" disabled >Select</option>
                                <option value="donation-creator">Donation Creator</option>
                                <option value="donation-viewer">Donation Viewer</option>
                                <option value="donation-editor">Donation Editor</option>
                                <option value="donation-deleter">Donation Deleter</option>
                                <option value="donation-contributor">Donation Contributor</option>
                                <option value="donation-manager">Donation Manager</option>
                                <option value="donation-supervisor">Donation Supervisor</option>
                            </Select>
                            <div className="my-4" >
                                <p>Change Operations</p>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox 
                                        id="create" 
                                        value="create" 
                                        onChange={handleChange} 
                                        checked={formData.actions && formData.actions.includes("create")} 
                                    />
                                    <Label htmlFor="create">Create</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox 
                                        id="read" 
                                        value="read" 
                                        onChange={handleChange} 
                                        checked={ formData.actions && formData.actions.includes("read")} 
                                    />
                                    <Label htmlFor="read">Read</Label>
                                 </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox 
                                        id="update" 
                                        value="update" 
                                        onChange={handleChange} 
                                        checked={ formData.actions && formData.actions.includes("update")} 
                                    />
                                    <Label htmlFor="update">Update</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox 
                                        id="delete" 
                                        value="delete" 
                                        onChange={handleChange} 
                                        checked={ formData.actions && formData.actions.includes("delete")} 
                                    />
                                    <Label htmlFor="delete">Delete</Label>
                                </div>
                            </div>
                        </div>
                        <div className="my-4 flex items-center gap-3" >
                            <Button onClick={()=> setShowModal(false)} color={"gray"} >Cancel</Button>
                            <Button 
                                onClick={handleUpdate} 
                                gradientMonochrome={"lime"} outline 
                            >
                                { loading ? <Spinner color={"success"} /> : 'Save Changes' }
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}