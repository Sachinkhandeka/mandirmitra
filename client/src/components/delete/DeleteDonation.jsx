import { Button, Modal, Spinner } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

export default function DeleteDonation({ showDeleteModal, setShowDeleteModal, setIsDonationUpdated, donationId, setError, setSuccess }) {
    const { currUser } = useSelector(state => state.user);
    const [ loading , setLoading ] = useState(false);

    //function to halde delete donation
    const handleDelete = async()=> {
        console.log("delete");
        try{
            setError(null);
            setLoading(true);
            setSuccess(null);
            const  response = await fetch(`/api/donation/delete/${currUser.templeId}/${donationId}`, { method : "DELETE" });
            const data = await response.json();

            if(!response.ok) {
                setLoading(false);
                setShowDeleteModal(false);
                return setError(data.message);
            }
            setLoading(false);
            setIsDonationUpdated(true);
            setSuccess("Donation Deleted Successfully.");
            setShowDeleteModal(false);
        }
        catch(err){
            setLoading(false);
            setError(err.message);
        }
    }
    return (
        <>
            <Helmet>
                <title>Delete Donation Confirmation - Temple Management</title>
                <meta name="description" content="Confirm deletion of a donation in the temple management system. Ensure your actions before proceeding." />
            </Helmet>
            <Modal show={showDeleteModal} size={"md"} dismissible onClose={()=> setShowDeleteModal(false)} popup >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this Donation?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDelete} disabled={loading}>
                                { loading ? <Spinner color={"failure"} /> : "Yes, I'm sure" }
                            </Button>
                            <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}