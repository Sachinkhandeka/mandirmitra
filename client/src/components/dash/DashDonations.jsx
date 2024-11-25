import { Table, Pagination, Button, Tooltip } from "flowbite-react";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { TbFaceIdError } from "react-icons/tb";
import { IoFilterCircleOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { debounce } from "lodash";
import Alert from "../Alert";
import Summary from "../Summary";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";

// importing components when needed or used
const EditDonationModal = React.lazy(()=> import("../edit/EditDonationModal"));
const DeleteDonation = React.lazy(()=> import("../delete/DeleteDonation"));
const FilterDrawer = React.lazy(()=> import("../FilterDrawer"));

export default function DashDonations() {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const { searchTerm } =  useSelector(state => state.searchTerm);
    const location = useLocation();
    const [ loading , setLoading ] =  useState(false);
    const [ alert, setAlert ] = useState({ type : "", message : "" });
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
        const tab = queryParams.get("tab");

        // Conditionally include searchTerm only when tab is 'daans'
        const searchParam = tab === 'daans' ? `&searchTerm=${searchTerm}` : '';
        try {
            setLoading(true);
            setAlert({ type : "", message : "" });
            
            // Fetch donation data from the API endpoint
            const data = await fetchWithAuth(
                `/api/donation/get/${currUser.templeId}${queryParams ? '?' + queryParams.toString() : ''}${searchParam}`,
                {},
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setLoading(false);
                setTotalDonations(data.total);
                setDonations(data.daans);
            }
            
        }catch(err) {
            setAlert({ type : "error", message : err.message });
        }
    }

    // Debounce getAllDonations function
    const debouncedFetchDonations = useCallback(debounce(getAllDonations, 500), [searchTerm, currUser, location.search]);

    // Effect hook to fetch donations when the isDonationUpdated is true
    useEffect(()=>{
        if(isDonationUpdated) {
            debouncedFetchDonations();
            setIsDonationUpdated(false);
        }
    },[isDonationUpdated]);

    // Effect hook to fetch donations when the component mounts or currUser changes
    useEffect(()=> {
        debouncedFetchDonations();
    },[ currUser, location.search, searchTerm ]);

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

    // Helper function to generate a concise address
    const formatAddress = (donation) => {
        const { village, tehsil, district, state, country } = donation;
        return [
            village && village.trim(),
            tehsil && tehsil.trim(),
            district && district.trim(),
            state && state.trim(),
            country && country.trim()
        ]
        .filter(Boolean) // Remove any empty fields
        .join(', '); // Join with a comma and space
    }
    return (
        <>
        <Helmet>
            <title>Manage Donations - Dashboard</title>
            <meta name="description" content="Manage and track donations in your temple dashboard. View, edit, and delete donations with ease." />
            <meta name="keywords" content="donations, manage donations, temple donations, donation management" />
        </Helmet>
        <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
            {alert.message && (
                <Alert 
                    type={alert.type}
                    message={alert.message}
                    autoDismiss
                    duration={6000}
                    onClose={()=> setAlert({ type : "", message : "" })}
                />
            )}
        </div>
        {/* Drawer toggler */}
        {
            (currUser && currUser.isAdmin || 
                (currUser.roles && currUser.roles.some(role=> 
                    role.permissions.some(p=> 
                        p.actions.includes("read") || p.actions.includes("update") || p.actions.includes("delete"))))) && (
                    <div className="mb-3 flex flex-row-reverse sticky left-0">
                        <Tooltip content={`${filterCount} filters applied`} placement="left">
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
                    <div className="flex overflow-x-auto sm:justify-center mb-5 sticky left-0">
                        <Pagination currentPage={currentPage} totalPages={Math.ceil(totalDonations / 20)} onPageChange={onPageChange} showIcons />
                    </div>
        ) }
        { donations && donations.length > 0 ? 
            // Render the table if user is an admin or has permission to read donations
            (currUser && currUser.isAdmin || 
            (currUser.roles && currUser.roles.some(role=> role.permissions.some(p=> p.actions.includes("read"))))) && (
                <>
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Donor Name</Table.HeadCell>
                        <Table.HeadCell>Contact</Table.HeadCell>
                        <Table.HeadCell>Name of Seva</Table.HeadCell>
                        <Table.HeadCell>Address</Table.HeadCell>
                        <Table.HeadCell>Payment Method</Table.HeadCell>
                        <Table.HeadCell>Amount</Table.HeadCell>
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
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" >{ donation.donorName }</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" >{ donation.contactInfo }</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" >{ donation.sevaName }</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {formatAddress(donation)}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" >{ donation.paymentMethod }</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" >
                                    { donation.donationAmount ? parseFloat(donation.donationAmount).toLocaleString('en-IN', {
                                        maximumFractionDigits: 2,
                                        style: 'currency',
                                        currency: 'INR'
                                    }) : ''}
                                </Table.Cell>
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
                {/* Donation Summary */}
                <div className="mb-3 flex flex-row-reverse sticky left-0 my-4 z-20" >
                    <Summary donations={donations} />
                </div>
            </>
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
            />
        )}
        {/* Delete Donation Modal */}
        { showDeleteModal && (
            <DeleteDonation 
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                setIsDonationUpdated={setIsDonationUpdated}
                donationId={donation._id}
                setAlert={setAlert}
            />
        ) }
        { totalDonations && totalDonations > 20 && (
            <div className="flex overflow-x-auto sm:justify-center mt-5  sticky left-0">
                <Pagination currentPage={currentPage} totalPages={Math.ceil(totalDonations / 20)} onPageChange={onPageChange} showIcons />
            </div>
        ) }
        </>
    );
}