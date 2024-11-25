import { Modal, Spinner, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useState } from "react";
import { useSelector } from "react-redux";
import Alert from "../Alert";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";

export default function DeleteInventory({ deleteModal, setDeleteModal, inventoryId, setIsDeleted, }) {
    const navigate = useNavigate();
    const  { currUser } = useSelector(state => state.user);
    const [ loading, setLoading ] = useState(false);
    const [ alert, setAlert ] = useState({ type : "", message : "" });

    //handle Delete functionality
    const handleDelete = async()=> {
        setLoading(true);
        setAlert({ type : "", message : "" });
        try {
            const data = await fetchWithAuth(
                `/api/inventory/delete/${inventoryId}/${currUser.templeId}`,
                {
                    method : "DELETE"
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setIsDeleted(true);
                setDeleteModal(false);
            }
        }catch(err) {
            setLoading(false);
            setAlert({ type : "error", message : err.message });
        }
    }
    return (
        <>
            <Modal show={deleteModal} size={"md"} dismissible onClose={()=> setDeleteModal(false)} >
                
                <Modal.Body>
                    <div className="text-center">
                        <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                            {alert && alert.message && (
                                <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                            )}
                        </div>
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this Inventory?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDelete} disabled={loading}>
                                { loading ? <Spinner color={"failure"} /> :  "Yes, I'm sure"}
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