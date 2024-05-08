import { Table, Toast, Pagination, Button, Tooltip } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { TbFaceIdError } from "react-icons/tb";
import { HiCheck, HiX } from "react-icons/hi";
import { IoFilterCircleOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";

// importing components when needed or used
const EditDonationModal = React.lazy(()=> import("../edit/EditDonationModal"));
const DeleteDonation = React.lazy(()=> import("../delete/DeleteDonation"));
const FilterDrawer = React.lazy(()=> import("../FilterDrawer"));

export default function DashDonations() {
    const { currUser } = useSelector(state => state.user);
    const location = useLocation();
    const [ loading , setLoading ] =  useState(false);
    const [ success , setSuccess ] =  useState(null);
    const [ error ,  setError ] = useState(null);
    const [ donations , setDonations ] =  useState([]);
    const [ showEditModal , setShowEditModal ] = useState(false);
    const [ showDeleteModal , setShowDeleteModal ] = useState(false);
    const [ donation , setDonation ] = useState({});
    const [ totalDonations, setTotalDonations ] = useState(null);
    const [ isDonationUpdated, setIsDonationUpdated ] = useState(false);
    const [ currentPage, setCurrentPage] = useState(1);
    const [ isDrawerOpen , setIsDrawerOpen ] = useState(false);
    const [ filterCount, setFilterCount ] = useState(0);

    const onPageChange = (page) => setCurrentPage(page);
    const queryParams = new URLSearchParams(location.search);

    // Function to fetch all donations from the API
    const  getAllDonations = async()=> {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Fetch donation data from the API endpoint
            const response = await fetch(`/api/donation/get/${currUser.templeId}${queryParams ? '?' + queryParams.toString() : ''}`);
            const data = await response.json();

            if(!response.ok) {
                setLoading(false);
                return setError(data.message);
            }

            setLoading(false);
            setSuccess("Donation data fetched successfully.");
            setTotalDonations(data.total);
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
    },[isDonationUpdated]);

    // Effect hook to fetch donations when the component mounts or currUser changes
    useEffect(()=> {
        getAllDonations();
    },[currUser, location.search ]);

    //function  to handle the edit functionality
    const handleEdit = (donation)=> {
        setShowEditModal(true);
        setDonation(donation)
    }

    //function to  handle the  delete functionality 
    const handleDelete = (donation)=> {
        setShowDeleteModal(true);
        setDonation(donation);
    }
    return (
        <>
        { success && (
            <Toast className="my-4" >
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                    <HiCheck className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">{ success }</div>
                <Toast.Toggle />
            </Toast> 
        ) }
        { error && (
            <Toast className="my-4" >
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                    <HiX className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">{ error }</div>
                <Toast.Toggle />
            </Toast> 
        ) }
        {/* Drawer toggler */}
        {
            (currUser && currUser.isAdmin || 
                (currUser.roles && currUser.roles.some(role=> role.permissions.some(p=> p.actions.includes("read"))))) && (
                    <div className="mb-3 flex flex-row-reverse sticky right-0">
                        <Tooltip content={`${filterCount} filters applied`}>
                            <Button color={"red"} onClick={()=> setIsDrawerOpen(true)} >
                                <IoFilterCircleOutline className="mr-2 h-5 w-5" />
                                Filters
                            </Button>
                        </Tooltip>
                    </div>
            )}
        {/* Drawer */}
        { isDrawerOpen &&
        (currUser && currUser.isAdmin || 
            (currUser.roles && currUser.roles.some(role=> 
                role.permissions.some(p=> p.actions.includes("read"))))) &&
            (
                <FilterDrawer 
                    isDrawerOpen={isDrawerOpen}
                    setIsDrawerOpen={setIsDrawerOpen}
                    filterCount={filterCount}
                    setFilterCount={setFilterCount}
                />
        ) }

        {/* pagination */}
        { totalDonations && totalDonations > 20 &&
            (currUser && currUser.isAdmin || 
               (currUser.roles && currUser.roles.some(role=> 
                role.permissions.some(p=> p.actions.includes("read"))))) && (
                    <div className="flex overflow-x-auto sm:justify-center mb-5">
                        <Pagination currentPage={currentPage} totalPages={Math.ceil(totalDonations / 20)} onPageChange={onPageChange} showIcons />
                    </div>
        ) }
        { donations && donations.length > 0 ? 
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
                                currUser.roles && currUser.roles.some(role => 
                                    role.permissions.some(p => p.actions.includes("update") || p.actions.includes("delete")))) && (
                                    <Table.HeadCell>Actions</Table.HeadCell>
                                )
                            )
                        }
                    </Table.Head>
                    { donations && donations.length > 0 && donations.slice((currentPage - 1) * 20, currentPage * 20 ).map((donation)=> (
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
                                    ( currUser.roles && currUser.roles.some(role => role.permissions.some(p => p.actions.includes("update") || p.actions.includes("delete") )) ) ) && (
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            <div className="flex justify-between items-center gap-4" >
                                                { 
                                                    // Render edit icon if user is admin or has permission to edit donations
                                                    ( currUser && currUser.isAdmin ||
                                                    ( currUser.roles && currUser.roles.some(role=> role.permissions.some(p=> p.actions.includes("update"))))) && (
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
        )
        : (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center flex flex-col items-center justify-center">
                    <TbFaceIdError size={50} className="animate-bounce" />
                    <p>No Donation Created Yet!</p>
                </div>
            </div>
        )}
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
        {/* Delete Donation Modal */}
        { showDeleteModal && (
            <DeleteDonation 
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                setIsDonationUpdated={setIsDonationUpdated}
                donationId={donation._id}
                setError={setError}
                setSuccess={setSuccess}
            />
        ) }
        { totalDonations && totalDonations > 20 && (
            <div className="flex overflow-x-auto sm:justify-center mt-5">
                <Pagination currentPage={currentPage} totalPages={Math.ceil(totalDonations / 20)} onPageChange={onPageChange} showIcons />
            </div>
        ) }
        </>
    );
}