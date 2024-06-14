import { Modal, Button, Spinner } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

export default function DeleteRoleModal({ deleteModal , setDeleteModal , setError , setRoleUpdated , roleId }) {
    const { currUser } = useSelector(state => state.user);
    const [ loading , setLoading ] = useState(false);

    //function to delete role
    const handleDelete = async()=> {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/role/delete/${currUser.templeId}/${roleId}`, { method : "DELETE" });
            const data = await response.json();

            if(!response.ok) {
                setLoading(false);
                return setError(data.message);
            }
            setLoading(false);
            setRoleUpdated(true);
            setDeleteModal(false);
        } catch(err) {
            setLoading(false);
            setError(err.message);
        }
    }
    return (
        <>
            <Helmet>
                <title>Delete Roles Confirmation - Temple Management</title>
                <meta name="description" content="Confirm deletion of a role in the temple management system. Ensure your actions before proceeding." />
            </Helmet>
           <Modal show={deleteModal} popup dismissible onClose={()=> setDeleteModal(false)} size="md" >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                         Are you sure you want to delete this Role?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDelete}>
                               { loading ? <Spinner color={"failure"} /> :  "Yes, I'm sure" }
                            </Button>
                            <Button color="gray" onClick={() => setDeleteModal(false)}>
                               No, cancel
                            </Button>
                       </div>
                     </div>
                </Modal.Body>
           </Modal>
        </>
    )
}