import { Modal, Button, Spinner } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";

export default function DeleteUserModal({ showModalDelete, setShowModalDelete , userId , setError , setSuccess , setUserDataUpdated }) {
  const { currUser } = useSelector(state  => state.user);
    const [ loading , setLoading ] = useState(false);
    
    const handleDelete = async()=> {
        try {
            setLoading(true);
            const response = await fetch(`/api/user/delete/${currUser.templeId}/${userId}`, { method : "DELETE" });
            const data = await response.json();

            if(!response.ok) {
                setLoading(false);
                setShowModalDelete(false);
                return setError(data.message);
            }
            setLoading(false);
            setShowModalDelete(false);
            setSuccess("User delete successfully.");
            setUserDataUpdated(true);
        }catch(err) {
            setLoading(true);
            setShowModalDelete(false);
            setError(err.message);
        }
    }
    return(
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
    );
}