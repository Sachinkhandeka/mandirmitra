import { Modal, Button, Spinner } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";
import { useNavigate } from "react-router-dom";

export default function DeleteExpense({ showDeleteModal, setShowDeleteModal, setIsUpdated, expenseId }) {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const [ loading, setLoading ] = useState(false);
    const [ alert, setAlert ] = useState({ type : "", message : "" });

    //handle Delete functionality
    const handleDelete = async()=> {
        setLoading(true);
        setAlert({ type : "", message : "" });
        try {
            const data = await fetchWithAuth(
                `/api/expense/delete/${expenseId}/${currUser.templeId}`,
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
                setIsUpdated(true);
                setShowDeleteModal(false);
            }
        }catch(err) {
            setLoading(false);
            setAlert({ type : "error", message : err.message });
        }
    }
    return (
        <>
        <Helmet>
            <title>Delete Expenses Confirmation - Temple Management</title>
            <meta name="description" content="Confirm deletion of a expense in the temple management system. Ensure your actions before proceeding." />
        </Helmet>
        <Modal show={showDeleteModal} size={"md"} dismissible onClose={()=> setShowDeleteModal(false)} popup >
            <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                            {alert && alert.message && (
                                <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                            )}
                        </div>
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this expense?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDelete}>
                                { loading ? <Spinner color={"failure"} /> :  "Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}