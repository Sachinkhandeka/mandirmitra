import { Alert, Button, Modal, Spinner } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DeletePermissionModal({ deleteModal , setDeleteModal , permissionId , setPermissionUpdated }) {
    const [ loading , setLoading ] = useState(false);
    const [ error , setError ] = useState(null);

    //function to handle delete
    const handleDelete = async(e)=> {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/permission/delete/${permissionId}`, { method : "DELETE" });
            const data = await response.json();

            if(!response.ok) {
                setLoading(false);
                return setError(data.message);
            }
            setLoading(false);
            setPermissionUpdated(true);
            setDeleteModal(false);
        } catch(err) {
            setLoading(false);
            setError(err.message);
        }
    }
    return (
        <>
          <Modal show={deleteModal} dismissible onClose={()=> setDeleteModal(false)} size={"md"} popup >
            <Modal.Header />
            <Modal.Body>
                { error && ( <Alert color={"failure"} onDismiss={()=> setError(null)} >{ error }</Alert> ) }
                <form>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this permission?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDelete} disabled={loading}>
                                { loading ? <Spinner color={"failure"} /> : "Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={() => setDeleteModal(false)}>
                                No, cancel
                            </Button>
                         </div>
                    </div>
                </form>
            </Modal.Body>
          </Modal>
        </>
    );
}