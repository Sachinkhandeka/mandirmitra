import { useSelector } from "react-redux";
import { Alert, Button, Card, Checkbox, Label, Modal, Select } from "flowbite-react";
import { useState } from "react";

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
        {
            currUser.isAdmin && (
                <>
                   <Card className=" w-full max-w-sm bg-gradient-to-t from-indigo-200 to-indigo-600">
                        <h5 className="text-2xl font-bold tracking-tight">Add Permissions</h5>
                        <Button onClick={()=> setOpenModal(true)} gradientMonochrome={"purple"} >Add</Button>
                    </Card>
                    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} position={"top-right"} >
                    <Modal.Header />
                    <Modal.Body>
                        <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add Permissions</h3>
                        { error && ( <Alert color={"failure"} onDismiss={ ()=> setError(null) }>{ error } </Alert>  ) }
                        { success  && ( <Alert color={"success"} onDismiss={ ()=> setSuccess(null) }>{ success }</Alert> ) }
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
                            <Button onClick={handleSubmit} >Add Permission</Button>
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