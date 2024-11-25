import { Button, Modal, Spinner } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";

export default function DeletePermissionModal({ deleteModal , setDeleteModal , permissionId , setPermissionUpdated }) {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const [ loading , setLoading ] = useState(false);
    const [ alert, setAlert ] = useState({ type : "", message : "" });

    //function to handle delete
    const handleDelete = async(e)=> {
        e.preventDefault();
        setLoading(true);
        setAlert({ type : "", message : "" });
        try {
            const data = await fetchWithAuth(
                `/api/permission/delete/${currUser.templeId}/${permissionId}`, 
                { method : "DELETE" },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setLoading(false);
                setPermissionUpdated(true);
                setDeleteModal(false);
            }
        } catch(err) {
            setLoading(false);
            setAlert({ type : "error", message : err.message });
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
                <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                    {alert && alert.message && (
                        <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                    )}
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