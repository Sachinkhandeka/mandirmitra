import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spinner } from "flowbite-react";
import { TbFaceIdError } from "react-icons/tb";

export default function GetTenants({ rentDetails, setRentDetails, onConfirm, selectedAssetId }) {
    const { currUser } = useSelector(state => state.user);
    const [tenants, setTenants] = useState([]);
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const getTenantsData = async () => {
        try {
            const response = await fetch(`/api/tenant/get/${currUser.templeId}`);
            const data = await response.json();

            if (!response.ok) {
                console.log(data);
                return;
            }
            setTenants(data.tenants);
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        if (currUser && currUser.templeId) {
            getTenantsData();
        }
    }, [currUser]);

    const getProfileLetters = (fullName) => {
        const slicedParts = fullName.split(' ');
        const firstLetters = slicedParts.map(chunk => chunk.charAt(0));
        return firstLetters.join('');
    };

    const toggleDropdown = (tenant) => {
        if (tenant) {
            if (selectedTenant && selectedTenant._id === tenant._id) {
                setSelectedTenant(null);
            } else {
                setSelectedTenant(tenant);
                setRentDetails(prevDetails => ({
                    ...prevDetails,
                    [selectedAssetId]: {
                        ...prevDetails[selectedAssetId],
                        tenant: tenant._id,
                    }
                }));
            }
        } else {
            setSelectedTenant(null);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRentDetails(prevDetails => ({
            ...prevDetails,
            [selectedAssetId]: {
                ...prevDetails[selectedAssetId],
                [name]: value
            }
        }));
    };

    const handleConfirm = async () => {
        setLoading(true);

        try {
            await onConfirm(rentDetails[selectedAssetId]);
        } catch (err) {
            console.log("Failed to add tenant. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const isFormComplete = rentDetails[selectedAssetId]?.tenant && rentDetails[selectedAssetId]?.rentAmount && rentDetails[selectedAssetId]?.leaseStartDate && rentDetails[selectedAssetId]?.leaseEndDate && rentDetails[selectedAssetId]?.paymentStatus;

    return (
        <>
            {tenants.length === 0 ? (
                <div className="flex justify-center items-center my-10">
                    <div className="text-center flex flex-col items-center justify-center">
                        <TbFaceIdError size={25} className="animate-bounce" />
                        <p className="text-xs" >No Tenants Found!</p>
                    </div>
                </div>
            ) : (
                <ul className="my-4 mx-4 space-y-3">
                    {tenants.map(tenant => (
                        <li key={tenant._id} className="relative">
                            <a 
                                className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white cursor-pointer" 
                                onClick={() => tenant.status === 'Active' && toggleDropdown(tenant)}
                            >
                                <div className="relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-400 rounded-full dark:bg-gray-800">
                                    <span className="text-xs text-gray-200 dark:text-gray-300">
                                        {getProfileLetters(tenant.name)}
                                    </span>
                                </div>
                                <span className="flex-1 ms-3 text-xs">{tenant.name}</span>
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <span className={`inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium rounded-sm ${tenant.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                        {tenant.status}
                                    </span>
                                    {tenant.status === 'Active' && (
                                        <span className={`inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium rounded-sm bg-blue-400 hover:bg-blue-600`}>
                                            {rentDetails[selectedAssetId]?.tenant === tenant._id ? 'Added' : 'Add'}
                                        </span>
                                    )}
                                </div>
                            </a>
                            {selectedTenant && selectedTenant._id === tenant._id && (
                                <div id="userDropdown" className="absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-52 dark:bg-gray-800 dark:divide-gray-600">
                                    <div className="px-2 py-1 text-sm text-gray-900 dark:text-white">
                                        <div>{selectedTenant.name}</div>
                                        <div className="font-medium truncate">{selectedTenant.email}</div>
                                    </div>
                                    <div className="px-2 py-2 text-sm text-gray-700 dark:text-gray-200">
                                        <div className="mb-2">
                                            <label htmlFor="rentAmount" className="block text-xs">Rent Amount</label>
                                            <input 
                                                type="number" 
                                                name="rentAmount" 
                                                id="rentAmount"
                                                className="block w-full px-2 py-1 mt-1 text-xs bg-white dark:bg-gray-600 text-black dark:text-white border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                value={rentDetails[selectedAssetId]?.rentAmount || ''}
                                                placeholder="Enter amount"
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="leaseStartDate" className="block text-xs">Lease Start Date</label>
                                            <input 
                                                type="date" 
                                                name="leaseStartDate" 
                                                id="leaseStartDate"
                                                className="block w-full px-2 py-1 mt-1 text-xs bg-white dark:bg-gray-600 text-black dark:text-white border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                value={rentDetails[selectedAssetId]?.leaseStartDate || ''}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="leaseEndDate" className="block text-xs">Lease End Date</label>
                                            <input 
                                                type="date" 
                                                name="leaseEndDate" 
                                                id="leaseEndDate"
                                                className="block w-full px-2 py-1 mt-1 text-xs bg-white dark:bg-gray-600 text-black dark:text-white border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                value={rentDetails[selectedAssetId]?.leaseEndDate || ''}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="paymentStatus" className="block text-xs">Payment Status</label>
                                            <select 
                                                name="paymentStatus" 
                                                id="paymentStatus"
                                                className="block w-full px-2 py-1 mt-1 text-xs bg-white dark:bg-gray-600 text-black dark:text-white border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                value={rentDetails[selectedAssetId]?.paymentStatus || ''}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Paid">Paid</option>
                                                <option value="Overdue">Overdue</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 p-2">
                                        <button 
                                            className="px-4 py-2 text-xs text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                                            onClick={() => toggleDropdown()}
                                        >
                                            Close
                                        </button>
                                        
                                        <button 
                                            className={`px-4 py-2 text-xs rounded ${isFormComplete ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-700'}`}
                                            onClick={handleConfirm}
                                            disabled={!isFormComplete || loading}
                                        >
                                            {loading ? <Spinner color="warning" aria-label="Purple spinner" /> : 'Confirm'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {error && <p className="text-sm text-red-600 bg-red-300">{error}</p>}
            {success && <p className="text-sm text-green-600 bg-green-300">{success}</p>}
        </>
    );
}
