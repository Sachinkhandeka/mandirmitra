import { useSelector } from "react-redux";
import { Button, Card, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";

export default function CreateRoles() {
    const [ openModal, setOpenModal ] = useState(false);
    const { currUser } = useSelector(state => state.user);

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
                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Add Roles</h5>
                        <Button onClick={()=> setOpenModal(true)} >Add</Button>
                    </Card>
                    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)}>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="space-y-6">
                         <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add Roles & Permissions</h3>
                        <div>
                            <div className="mb-2 block">
                             <Label htmlFor="name" value="Add role name" />
                         </div>
                          <TextInput id="name" placeholder="Daan" required />
                         </div>
                         <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <Checkbox id="remember" />
                             <Label htmlFor="remember">Remember me</Label>
                         </div>
                         </div>
                         <div className="w-full">
                            <Button>Log in to your account</Button>
                         </div>
                     </div>
                     </Modal.Body>
                 </Modal>
                </>
            )
        }
        </>
    );
}