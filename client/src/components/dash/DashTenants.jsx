import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import debounce from "lodash/debounce";
import { TbFaceIdError } from "react-icons/tb";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";
import Alert from "../Alert";

const EditTenant = React.lazy(()=> import("../edit/EditTenant"));
const DeleteTenant = React.lazy(()=> import("../delete/DeleteTenant"));

export default function DashTenants() {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const [tenants, setTenants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTenant, setSelectedTenant] = useState({});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTenantId, setSelectedTenantId] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type : "", message : "" });

    const getTenantsData = async (searchQuery) => {
        setLoading(true);
        setAlert({ type : "", message : "" });
        try {
            let url = `/api/tenant/get/${currUser.templeId}`;
            if (searchQuery) {
                url += `?search=${searchQuery}`;
            }
            const data = await fetchWithAuth(
                url,
                {},
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setLoading(false);
                setTenants(data.tenants);
            }
        } catch (err) {
            setLoading(false);
            setAlert({ type : "error", message : err.message });
        }
    };

    const debouncedGetTenantsData = useCallback(debounce(getTenantsData, 800), []);

    useEffect(() => {
        if (currUser && currUser.templeId) {
            getTenantsData('');
        }
    }, [currUser]);

    useEffect(() => {
        if (searchTerm !== '') {
            debouncedGetTenantsData(searchTerm);
        } else {
            debouncedGetTenantsData('');
        }
    }, [searchTerm, debouncedGetTenantsData]);

    const getProfileLetters = (fullName) => {
        const slicedParts = fullName.split(' ');
        const firstLetters = slicedParts.map(chunk => chunk.charAt(0));
        return firstLetters.join('');
    };

    const handleEditClick = (tenant)=> {
        setSelectedTenant(tenant);
        setIsEditModalOpen(true);
    }

    const handleDeleteClick = (tenant)=> {
        setSelectedTenantId(tenant._id);
        setIsDeleteModalOpen(true);
    }

    const hasPermission = (action) => {
        return (
            currUser && currUser.isAdmin ||
            (currUser.roles && currUser.roles.some(role =>
                role.permissions.some(p => p.actions.includes(action))
            ))
        );
    };

    const getCurrentMetaTags = (isEditModalOpen, isDeleteModalOpen) => {
        if (isEditModalOpen) {
            return {
                title: 'Edit Tenant | MandirMitra',
                description: 'Edit tenant details in your temple management system.',
                keywords: 'edit tenant, temple management, MandirMitra'
            };
        }
    
        if (isDeleteModalOpen) {
            return {
                title: 'Delete Tenant | MandirMitra',
                description: 'Remove a tenant from your temple management system.',
                keywords: 'delete tenant, temple management, MandirMitra'
            };
        }
        return {
            title: 'Manage Tenants | MandirMitra',
            description: 'View and manage tenants in your temple management system.',
            keywords: 'manage tenants, view tenants, temple management, MandirMitra'
        };
    };
    const metaTags = getCurrentMetaTags(isEditModalOpen, isDeleteModalOpen);
    return (
        <section className="relative min-h-screen overflow-x-auto scrollbar-hidden shadow-md sm:rounded-lg">
            <Helmet>
                <title>{metaTags.title}</title>
                <meta name="description" content={metaTags.description} />
                <meta name="keywords" content={metaTags.keywords} />
            </Helmet>
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                )}
            </div>
            <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
                <label htmlFor="table-search" className="sr-only">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        id="table-search-users" 
                        className={`block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 
                            focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 
                            dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                        placeholder="Search for tenants"
                        onChange={(e)=> setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            { tenants && tenants.length > 0 && hasPermission("read") ? (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Contact Info</th>
                        <th scope="col" className="px-6 py-3">Address</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        {
                            (currUser && currUser.isAdmin ||
                                currUser.roles && currUser.roles.some(role => 
                                    role.permissions.some(p => p.actions.includes("update") || p.actions.includes("delete")))) && (
                                <th scope="col" className="px-6 py-3">Action</th>
                            )
                        }
                    </tr>
                </thead>
                <tbody>
                    {tenants && tenants.map((tenant) => (
                        <tr key={tenant._id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-400 rounded-full dark:bg-gray-800">
                                    <span className="font-medium text-gray-200 dark:text-gray-300">
                                        {getProfileLetters(tenant.name)}
                                    </span>
                                </div>
                                <div className="ps-3">
                                    <div className="text-base font-semibold">{tenant.name}</div>
                                    <div className="font-normal text-gray-500">{tenant.email}</div>
                                </div>
                            </th>
                            <td className="px-6 py-4">
                                {tenant.contactInfo}
                            </td>
                            <td className="px-6 py-4">
                                {tenant.address}, {tenant.pinCode}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className={`h-2.5 w-2.5 rounded-full ${tenant.status === 'Active' ? 'bg-green-500' : 'bg-red-500'} me-2`}></div> {tenant.status}
                                </div>
                            </td>
                            {
                                (currUser && currUser.isAdmin ||
                                    currUser.roles && currUser.roles.some(role => 
                                        role.permissions.some(p => p.actions.includes("update") || p.actions.includes("delete")))) && (
                                    <td className="px-6 py-4 flex items-center justify-center gap-2">
                                        {
                                            (currUser && currUser.isAdmin ||
                                                currUser.roles && currUser.roles.some(role => 
                                                    role.permissions.some(p => p.actions.includes("update")))) && (
                                                <> 
                                                    <span 
                                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer" 
                                                        onClick={()=> handleEditClick(tenant)}
                                                    >
                                                        Edit
                                                    </span>
                                                </>
                                            )
                                        }
                                        {
                                            (currUser && currUser.isAdmin ||
                                                currUser.roles && currUser.roles.some(role => 
                                                    role.permissions.some(p => p.actions.includes("delete")))) && (
                                                <>
                                                    <span 
                                                        className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer" 
                                                        onClick={()=> handleDeleteClick(tenant)} 
                                                    >
                                                        Remove
                                                    </span>
                                                </>
                                            )
                                        }
                                    </td>
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
                        <p>No Tenants created yet!</p>
                    </div>
                </div>
            ) }
            {
                selectedTenant && (
                    <EditTenant 
                        tenant={selectedTenant}
                        isOpen={isEditModalOpen}
                        onClose={()=> setIsEditModalOpen(false)}
                        refreshTenants={()=> getTenantsData('')}
                    />
                )
            }
            {
                selectedTenantId && (
                    <DeleteTenant 
                        tenantId={selectedTenantId}
                        isOpen={isDeleteModalOpen}
                        onClose={()=> setIsDeleteModalOpen(false)}
                        refreshTenants={()=> getTenantsData('')}
                    />
                )
            }
        </section>
    );
}
