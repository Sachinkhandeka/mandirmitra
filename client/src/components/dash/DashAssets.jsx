import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import debounce from "lodash/debounce";
import { TbFaceIdError } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import GetTenants from "../GetTenants";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Modal, Button, Spinner } from "flowbite-react";
import { PopOver } from "../PopOver";

const EditAsset = React.lazy(()=> import("../edit/EditAsset"));
const DeleteAsset = React.lazy(()=> import("../delete/DeleteAsset"));

export default function DashAssets() {
    const { currUser } = useSelector(state => state.user);
    const [assets, setAssets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState({});
    const [rentDetails, setRentDetails] = useState({});
    const [selectedAssetId, setSelectedAssetId] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [assetToRemove, setAssetToRemove] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState({});
    const [isEditAssetOpen, setIsEditAssetOpen] =  useState(false);
    const [assetId, setAssetId] = useState("");
    const [isDeleteAssetOpen, setIsDeleteAssetOpen] = useState(false);


    const getAssetsData = async (searchQuery = '') => {
        try {
            let url = `/api/asset/get/${currUser.templeId}`;
            if (searchQuery) {
                url += `?search=${searchQuery}`;
            }
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                console.log(data.message);
                return;
            }
            setAssets(data.assets);
            const newRentDetails = {};
            data.assets.forEach(asset => {
                newRentDetails[asset._id] = {
                    tenant: asset.rentDetails?.tenant || "",
                    rentAmount: asset.rentDetails?.rentAmount || "",
                    leaseStartDate: asset.rentDetails?.leaseStartDate || "",
                    leaseEndDate: asset.rentDetails?.leaseEndDate || "",
                    paymentStatus: asset.rentDetails?.paymentStatus || "Pending"
                };
            });
            setRentDetails(newRentDetails);
        } catch (err) {
            console.log(err.message);
        }
    };

    const debouncedGetAssetsData = useCallback(debounce(getAssetsData, 800), []);

    useEffect(() => {
        if (currUser && currUser.templeId) {
            getAssetsData('');
        }
    }, [currUser]);

    useEffect(() => {
        if (searchTerm !== '') {
            debouncedGetAssetsData(searchTerm);
        } else {
            debouncedGetAssetsData('');
        }
    }, [searchTerm, debouncedGetAssetsData]);

    const toggleDropdown = (assetId) => {
        setDropdownVisible(prevState => ({
            ...prevState,
            [assetId]: !prevState[assetId]
        }));
        setSelectedAssetId(assetId);
    };

    const addTenantToAsset = async (assetId, details) => {
        try {
            const response = await fetch(
                `/api/asset/addTenant/${currUser.templeId}/${assetId}`,
                {
                    method: "PUT",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ rentDetails: details })
                }
            );

            if (!response.ok) {
                const data = await response.json();
                console.log(data.message);
                return;
            }

            setRentDetails(prevDetails => ({
                ...prevDetails,
                [assetId]: {
                    tenant: "",
                    rentAmount: "",
                    leaseStartDate: "",
                    leaseEndDate: "",
                    paymentStatus: "Pending"
                }
            }));
            setDropdownVisible(prevState => ({
                ...prevState,
                [assetId]: false
            }));
            
            getAssetsData(searchTerm);
        } catch (err) {
            console.log(err.message);
        }
    };

    const removeTenantFromAsset = async (assetId) => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/asset/removeTenant/${currUser.templeId}/${assetId}`,
                {
                    method: "PUT",
                    headers: { "content-type": "application/json" }
                }
            );

            if (!response.ok) {
                const data = await response.json();
                setLoading(false);
                return;
            }

            setLoading(false);
            getAssetsData(searchTerm);
            setOpenModal(false);
        } catch (err) {
            setLoading(false);
        }
    };

    const getProfileLetters = (fullName) => {
        const slicedParts = fullName.split(' ');
        const firstLetters = slicedParts.map(chunk => chunk.charAt(0));
        return firstLetters.join('');
    };

    const handleEditClick = (tenant)=> {
        setSelectedAsset(tenant);
        setIsEditAssetOpen(true);
    }
    const handleDeleteClick = (tenant)=> {
        setAssetId(tenant._id);
        setIsDeleteAssetOpen(true);
    }

    const hasPermission = (action) => {
        return (
            currUser && currUser.isAdmin ||
            (currUser.roles && currUser.roles.some(role =>
                role.permissions.some(p => p.actions.includes(action))
            ))
        );
    };
    return (
        <section className="relative min-h-screen overflow-x-auto scrollbar-hidden shadow-md sm:rounded-lg">
            <div className="pb-4 bg-white dark:bg-gray-900">
                <label htmlFor="table-search" className="sr-only">Search</label>
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="table-search"
                        className="block pt-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search for assets"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            {assets.length > 0 && hasPermission("read") ? (
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Location</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Acquisition Date</th>
                            <th scope="col" className="px-6 py-3">Acquisition Cost</th>
                            <th scope="col" className="px-6 py-3">Current Value</th>
                            {
                                (currUser && currUser.isAdmin ||
                                    currUser.roles && currUser.roles.some(role => 
                                        role.permissions.some(p => p.actions.includes("update") || p.actions.includes("delete")))) && (
                                            <th scope="col" className="px-6 py-3">Tenant</th>
                                        )
                            }
                            {
                                (currUser && currUser.isAdmin ||
                                    currUser.roles && currUser.roles.some(role => 
                                        role.permissions.some(p => p.actions.includes("update") || p.actions.includes("delete")))) && (
                                            <th scope="col" className="px-6 py-3">Actions</th>
                                )
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map(asset => (
                            <tr key={asset._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                { asset.rentDetails.tenant ? (
                                    <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        <div className="relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-400 rounded-full dark:bg-gray-500">
                                            <span className="text-xs text-gray-100 dark:text-gray-300">
                                                {getProfileLetters(asset.rentDetails.tenant.name)}
                                            </span>
                                        </div>
                                        <div className="ps-3">
                                            <div className="text-base font-semibold">{ asset.name }</div>
                                            <span className="flex items-center gap-2" >
                                                <div className="font-normal text-gray-500">{asset.rentDetails.tenant.name}</div>
                                                <PopOver asset={asset}/>
                                            </span>  
                                        </div>
                                    </th>
                                )
                                :(
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{asset.name}</th>
                                )}
                                <td className="px-6 py-4">{asset.assetType}</td>
                                <td className="px-6 py-4">{asset.address}, {asset.pincode}</td>
                                <td className="px-6 py-4">{asset.status}</td>
                                <td className="px-6 py-4">{asset.acquisitionDate ? new Date(asset.acquisitionDate).toLocaleDateString() : "N/A"}</td>
                                <td className="px-6 py-4">
                                    {asset.acquisitionCost ? 
                                    `${ new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(asset.acquisitionCost)}` : "N/A"}
                                </td>
                                <td className="px-6 py-4">
                                    {asset.currentValue ? 
                                    `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(asset.currentValue)}` : "N/A"}
                                </td>
                                {
                                    (currUser && currUser.isAdmin ||
                                        currUser.roles && currUser.roles.some(role => 
                                            role.permissions.some(p => p.actions.includes("update") || p.actions.includes("delete")))) && (
                                                <td className="px-6 py-4 relative">
                                                    <div className="flex items-center">
                                                        {asset.rentDetails.tenant ? (
                                                            <>
                                                            {
                                                                (currUser && currUser.isAdmin ||
                                                                    currUser.roles && currUser.roles.some(role => 
                                                                        role.permissions.some(p => p.actions.includes("delete")))) && (
                                                                            <button
                                                                                onClick={() => {
                                                                                    setAssetToRemove(asset._id);
                                                                                    setOpenModal(true);
                                                                                }}                                                
                                                                                className="ml-2 text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        )
                                                            }
                                                            </>
                                                        ) : (
                                                            <>
                                                            {
                                                                (currUser && currUser.isAdmin ||
                                                                    currUser.roles && currUser.roles.some(role => 
                                                                        role.permissions.some(p => p.actions.includes("update")))) && (
                                                                            <a
                                                                                onClick={() => toggleDropdown(asset._id)}
                                                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                                                                            >
                                                                                Add
                                                                            </a>
                                                                        )
                                                            }
                                                                {dropdownVisible[asset._id] && (
                                                                    <div id="tenantDropdown" className="absolute top-2 right-24 md:right-28 lg:right-32 max-h-60 overflow-y-auto scrollbar-hidden z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-60 dark:bg-gray-700 dark:divide-gray-600">
                                                                        <div className="flex items-center justify-end sticky top-0 p-2 z-30 bg-gray-200 dark:bg-gray-500">
                                                                            <IoIosClose size={20} onClick={() => toggleDropdown(asset._id)} className="text-black dark:text-white hover:bg-gray-400 hover:dark:bg-gray-600 rounded-md" />
                                                                        </div>
                                                                        <GetTenants 
                                                                            rentDetails={rentDetails}
                                                                            setRentDetails={setRentDetails}
                                                                            onConfirm={(details) => addTenantToAsset(asset._id, details)}
                                                                            selectedAssetId={selectedAssetId}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            )
                                }
                                {
                                    (currUser && currUser.isAdmin ||
                                        currUser.roles && currUser.roles.some(role => 
                                            role.permissions.some(p => p.actions.includes("update") || p.actions.includes("delete")))) && (
                                        <>
                                            <td className="px-6 py-6 flex items-center justify-center gap-2">
                                                { (currUser && currUser.isAdmin ||
                                                        currUser.roles && currUser.roles.some(role => 
                                                            role.permissions.some(p => p.actions.includes("update")))) && (
                                                    <>
                                                        <span 
                                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer" 
                                                            onClick={()=> handleEditClick(asset)}
                                                        >
                                                            Edit
                                                        </span>
                                                    </>
                                                ) }
                                                { 
                                                    (currUser && currUser.isAdmin ||
                                                        currUser.roles && currUser.roles.some(role => 
                                                            role.permissions.some(p => p.actions.includes("delete")))) && (
                                                    <>
                                                        <span 
                                                            className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer" 
                                                            onClick={()=> handleDeleteClick(asset)} 
                                                        >
                                                            Remove
                                                        </span>
                                                    </>
                                                ) }
                                            </td>
                                        </>
                                    )
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="flex justify-center items-center h-screen">
                    <div className="text-center flex flex-col items-center justify-center">
                        <TbFaceIdError size={50} className="animate-bounce" />
                        <p>No Assets created yet!</p>
                    </div>
                </div>
            )}
            {openModal && (
                <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                    <Modal.Header />
                    <Modal.Body >
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-red-600" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Are you sure you want to remove this tenant?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button
                                    color="failure"
                                    onClick={() => {
                                        if (assetToRemove) {
                                            removeTenantFromAsset(assetToRemove);
                                        }
                                    }}
                                    disabled={loading}
                                >
                                    {
                                        loading ? <Spinner color="failure" /> : "Yes, I'm sure"
                                    }
                                </Button>
                                <Button color="gray" onClick={() => setOpenModal(false)}>
                                    No, cancel
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
            {
                isEditAssetOpen && (
                    <EditAsset 
                        asset={selectedAsset}
                        isOpen={isEditAssetOpen}
                        onClose={()=> setIsEditAssetOpen(false)}
                        refreshAssets={()=> getAssetsData()}
                    />
                )
            }
            {
                isDeleteAssetOpen && (
                    <DeleteAsset 
                        assetId={assetId}
                        isOpen={isDeleteAssetOpen}
                        onClose={()=> setIsDeleteAssetOpen(false)}
                        refreshAssets={()=> getAssetsData()}
                    />
                )
            }
        </section>
    );
}
