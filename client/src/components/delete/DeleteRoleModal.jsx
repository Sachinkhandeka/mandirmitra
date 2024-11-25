import { Modal, Button, Spinner } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";

export default function DeleteRoleModal({ deleteModal , setDeleteModal , setAlert , setRoleUpdated , roleId }) {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const [ loading , setLoading ] = useState(false);

    //function to delete role
    const handleDelete = async()=> {
        setLoading(true);
        setAlert({ type : "", message : "" });
        try {
            const data = await fetchWithAuth(
                `/api/role/delete/${currUser.templeId}/${roleId}`, 
                { method : "DELETE" },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setLoading(false);
                setRoleUpdated(true);
                setDeleteModal(false);
                setAlert({ type : "success", message : "Role deleted successfully" });
            }
        } catch(err) {
            setLoading(false);
            setAlert({ type : "error", message : err.message });
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