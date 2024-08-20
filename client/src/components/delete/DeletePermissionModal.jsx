import { Button, Modal, Spinner } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";

export default function DeletePermissionModal({ deleteModal , setDeleteModal , permissionId , setPermissionUpdated }) {
    const { currUser } = useSelector(state => state.user);
    const [ loading , setLoading ] = useState(false);
    const [ error , setError ] = useState(null);

    //function to handle delete
    const handleDelete = async(e)=> {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/permission/delete/${currUser.templeId}/${permissionId}`, { method : "DELETE" });
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
        <Helmet>
            <title>Delete Permissions Confirmation - Temple Management</title>
            <meta name="description" content="Confirm deletion of a permission in the temple management system. Ensure your actions before proceeding." />
        </Helmet>
        <Modal show={deleteModal} dismissible onClose={()=> setDeleteModal(false)} size={"md"} popup >
            <Modal.Header />
            <Modal.Body>
                <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                    {error && ( <Alert type="error" message={error} autoDismiss duration={6000} onClose={() => setError(null)} /> )}
                </div>
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