import { Modal, Button, Spinner } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";

export default function DeleteUserModal({ showModalDelete, setShowModalDelete , userId , setAlert, setUserDataUpdated }) {
  const navigate = useNavigate();
  const { currUser } = useSelector(state  => state.user);
    const [ loading , setLoading ] = useState(false);
    
    const handleDelete = async()=> {
        try {
            setLoading(true);
            setAlert({ type : "", message : "" });
            const data = await fetchWithAuth(
              `/api/user/delete/${currUser.templeId}/${userId}`,
              { method : "DELETE" },
              refreshSuperAdminOrUserAccessToken,
              "User",
              setLoading,
              setAlert,
              navigate,
            );
            if(data) {
              setLoading(false);
              setShowModalDelete(false);
              setAlert({ type : "success", message : "User delete successfully." });
              setUserDataUpdated(true);
            }
        }catch(err) {
            setLoading(true);
            setShowModalDelete(false);
            setAlert({ type : "error", message : err.message });
        }
    }
    return(
        <>
        <Helmet>
            <title>Delete Users Confirmation - Temple Management</title>
            <meta name="description" content="Confirm deletion of a user in the temple management system. Ensure your actions before proceeding." />
        </Helmet>
        <Modal show={showModalDelete} popup dismissible onClose={()=> setShowModalDelete(false)} size={"md"}>
            <Modal.Header />
            <Modal.Body>
                <div className="text-center">
                   <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                   <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                     Are you sure you want to delete this user?
                   </h3>
                   <div className="flex justify-center gap-4">
                     <Button color="failure" onClick={handleDelete}>
                       { loading ? ( <Spinner color={"failure"} /> ) : "Yes, I'm sure"}
                     </Button>
                     <Button color="gray" onClick={() => setShowModalDelete(false)}>
                       No, cancel
                     </Button>
                   </div>
                 </div>
            </Modal.Body>
        </Modal>
        </>
    );
}