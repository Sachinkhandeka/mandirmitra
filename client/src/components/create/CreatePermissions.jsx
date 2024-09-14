import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { Button, Card, Checkbox, Label, Modal, Select } from "flowbite-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";

export default function CreatePermissions({ setUpdated }) {
    const [ openModal, setOpenModal ] = useState(false);
    const { currUser } = useSelector(state => state.user);
    const [ permissionName , setPermissionName ] = useState('donation-creator');
    const [ actions , setActions ] = useState([]);
    const [ success , setSuccess ] = useState(null);
    const [ error , setError ] = useState(null);

    //handle actions 
    const handleChange = (e)=> {
        if(actions.includes(e.target.id)) {
            return setActions(actions.filter(el => el !== e.target.id));
        }else {
        setActions([
            ...actions,
            e.target.id
        ]);
    }
    }
    const handleSubmit = async(e)=> {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const  response = await fetch(
                "/api/permission/create",
                {
                    method : "POST",
                    headers : { "Content-Type" : "application/json" },
                    body : JSON.stringify({ permissionName , actions , templeId : currUser.templeId }),
                }
            );
            const data =  await response.json();

            if(!response.ok) {
                return  setError(data.message);
            }
            setUpdated(true);
            setSuccess(data);
        }catch(err) {
            setError(err.message);
        }
    }

    return (
        <>
        <Helmet>
            <title>Create Permissions - Your Dashboard</title>
            <meta name="description" content="Create and assign permissions with specific actions. Fill out the form to add a new permission." />
        </Helmet>
        {
            currUser.isAdmin && (
                <>
                    <div className="p-0.5 bg-gradient-to-r from-purple-400 to-purple-700 rounded-lg">
                        <Card className="w-full h-full bg-white">
                             <div className="flex items-center md:flex-col gap-4" >
                                 <span className=" h-20 w-20 flex items-center justify-center p-2 bg-gradient-to-r from-purple-400 to-purple-700 rounded-md" ><FaEdit size={30} /></span>
                                 <h5 className="text-2xl font-bold tracking-tight">Add Permissions</h5>
                             </div>
                             <Button onClick={()=> setOpenModal(true)} gradientMonochrome={"purple"} >Add</Button>
                         </Card>
                    </div>
                    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)}>
                    <Modal.Header className="bg-gradient-to-r from-purple-400 to-purple-700 text-2xl p-4 font-medium text-gray-900 dark:text-white" >
                        Add Permissions
                    </Modal.Header>
                    <Modal.Body>
                        <div className="space-y-6">
                            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                                { error && ( <Alert type="error" message={error} autoDismiss duration={6000} onClose={()=> setError(null)} /> ) }
                                { success  && ( <Alert type="success" message={success} autoDismiss duration={6000} onClose={()=> setSuccess(null)} /> ) }
                            </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-8" >
                        <div >
                            <div className="mb-2 block">
                             <Label htmlFor="permissionName" value="Add permission name" />
                        </div>
                          <Select id="permissionName" required onChange={(e)=> setPermissionName(e.target.value)}>
                                <option value="select" disabled>Select</option>
                                <option value="donation-creator">Donation Creator</option>
                                <option value="donation-viewer">Donation Viewer</option>
                                <option value="donation-editor">Donation Editor</option>
                                <option value="donation-deleter">Donation Deleter</option>
                                <option value="donation-contributor">Donation Contributor</option>
                                <option value="donation-manager">Donation Manager</option>
                                <option value="donation-supervisor">Donation Supervisor</option>
                          </Select>
                         </div>
                         <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <Checkbox id="create" onChange={handleChange} />
                              <Label htmlFor="create">Create</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox id="read" onChange={handleChange}  />
                              <Label htmlFor="read">Read</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox id="update" onChange={handleChange}  />
                              <Label htmlFor="update">Update</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Checkbox id="delete" onChange={handleChange}  />
                              <Label htmlFor="delete">Delete</Label>
                            </div>
                         </div>
                         <div className="w-full my-3">
                            <Button onClick={handleSubmit} gradientMonochrome={"purple"} outline >Add Permission</Button>
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