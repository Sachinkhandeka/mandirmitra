import { Modal, Button, Spinner, Alert } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

export default function DeleteExpense({ showDeleteModal, setShowDeleteModal, setIsUpdated, expenseId }) {
    const { currUser } = useSelector(state => state.user);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ]  = useState(null);

    //handle Delete functionality
    const handleDelete = async()=> {
        try {
            const response = await fetch(
                `/api/expense/delete/${expenseId}/${currUser.templeId}`,
                {
                    method : "DELETE"
                }
            );
            const data =  await response.json();

            if(!response.ok){
                setLoading(false);
                return setError(data.message);
            }
            setIsUpdated(true);
            setShowDeleteModal(false);
        }catch(err) {
            setError(err.message);
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
                        { error && ( <Alert onDismiss={()=> setError(null)} color={"failure"} className="my-4">{error}</Alert> ) }
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