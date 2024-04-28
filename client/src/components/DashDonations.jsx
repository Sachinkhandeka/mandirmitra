import { Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";

const EditDonationModal = React.lazy(()=> import("./EditDonationModal"));

export default function DashDonations() {
    const { currUser } = useSelector(state => state.user);
    const [ loading , setLoading ] =  useState(false);
    const [ success , setSuccess ] =  useState(null);
    const [ error ,  setError ] = useState(null);
    const [ donations , setDonations ] =  useState([]);
    const [ showEditModal , setShowEditModal ] = useState(false);
    const [ showDeleteModal , setShowDeleteModal ] = useState(false);
    const [ donation , setDonation ] = useState({});
    const [ isDonationUpdated, setIsDonationUpdated ] = useState(false);

    // Function to fetch all donations from the API
    const  getAllDonations = async()=> {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Fetch donation data from the API endpoint
            const response = await fetch(`/api/donation/get/${currUser.templeId}`);
            const data = await response.json();

            if(!response.ok) {
                setLoading(false);
                return setError(data.message);
            }

            setLoading(false);
            setSuccess("Donation data fetched successfully.");
            setDonations(data.daans);
            
        }catch(err) {
            setError(err.message);
        }
    }

    // Effect hook to fetch donations when the isDonationUpdated is true
    useEffect(()=>{
        if(isDonationUpdated) {
            getAllDonations();
            setIsDonationUpdated(false);
        }
    },[isDonationUpdated])

    // Effect hook to fetch donations when the component mounts or currUser changes
    useEffect(()=> {
        getAllDonations();
    },[currUser]);

    //function  to handle the edit functionality
    const handleEdit = (donation)=> {
        setShowEditModal(true);
        setDonation(donation)
    }
    return (
        <>
        { 
            // Render the table if user is an admin or has permission to read donations
            (currUser && currUser.isAdmin || 
            (currUser.roles && currUser.roles.some(role=> role.permissions.some(p=> p.actions.includes("read"))))) && (
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Id</Table.HeadCell>
                        <Table.HeadCell>Donor Name</Table.HeadCell>
                        <Table.HeadCell>Contact</Table.HeadCell>
                        <Table.HeadCell>Temple</Table.HeadCell>
                        <Table.HeadCell>Name of Seva</Table.HeadCell>
                        <Table.HeadCell>Payment Method</Table.HeadCell>
                        <Table.HeadCell>Amount</Table.HeadCell>
                        <Table.HeadCell>Village</Table.HeadCell>
                        <Table.HeadCell>Tehsil</Table.HeadCell>
                        <Table.HeadCell>District</Table.HeadCell>
                        <Table.HeadCell>State</Table.HeadCell>
                        <Table.HeadCell>Country</Table.HeadCell>
                        {/* Render actions if user is an admin or has permission to edit or delete donations */}
                        {
                            (
                                (currUser && currUser.isAdmin ||
                                currUser.roles && currUser.roles.some(role => role.permissions.some(p => p.actions.includes("edit","delete")))) && (
                                    <Table.HeadCell>Actions</Table.HeadCell>
                                )
                            )
                        }
                    </Table.Head>
                    { donations && donations.map((donation)=> (
                        <Table.Body className="divide-y" key={donation._id} >
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" >
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" >{ donation._id }</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" >{ donation.donorName }</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" >{ donation.contactInfo }</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" >{ donation.temple.name }</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" >{ donation.sevaName }</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" >{ donation.paymentMethod }</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" >
                                    { donation.donationAmount ? parseFloat(donation.donationAmount).toLocaleString('en-IN', {
                                        maximumFractionDigits: 2,
                                        style: 'currency',
                                        currency: 'INR'
                                    }) : ''}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" >{ donation.village }</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" >{ donation.tehsil }</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" >{ donation.district }</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" >{ donation.state }</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" >{ donation.country }</Table.Cell>

                                {/* Render edit and delete icons if user is an admin or has permission to edit or delete donations */}
                                {
                                    ( currUser && currUser.isAdmin ||
                                    ( currUser.roles && currUser.roles.some(role => role.permissions.some(p => p.actions.includes("edit","delete"))) ) ) && (
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            <div className="flex justify-between items-center gap-4" >
                                                { 
                                                    // Render edit icon if user is admin or has permission to edit donations
                                                    ( currUser && currUser.isAdmin ||
                                                    ( currUser.roles && currUser.roles.some(role=> role.permissions.some(p=> p.actions.includes("edit"))))) && (
                                                        <span className="cursor-pointer" >
                                                            <FaPencil onClick={()=> handleEdit(donation)} size={16} color="teal"/>
                                                        </span>
                                                    )
                                                }
                                                { 
                                                    // Render delete icon if user is admin or has permission to delete donations
                                                    ( currUser && currUser.isAdmin ||
                                                    ( currUser.roles && currUser.roles.some(role=> role.permissions.some(p=> p.actions.includes("delete"))))) && (
                                                        <span className="cursor-pointer" >
                                                            <MdDelete onClick={()=> handleDelete(donation)} size={20} color="red"/>
                                                        </span>
                                                    )
                                                }
                                            </div>
                                        </Table.Cell>
                                    )
                                }
                            </Table.Row>
                        </Table.Body>
                    )) }
                </Table>
        ) }
        {/* Edit Donation Modal */}
        { showEditModal && (
            <EditDonationModal 
                showEditModal={showEditModal}
                setShowEditModal={setShowEditModal}
                donation={donation}
                setIsDonationUpdated={setIsDonationUpdated}
                error={error}
                setError={setError}
                success={success}
                setSuccess={setSuccess}
            />
        )}
        </>
    );
}