import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaPhoneAlt, FaAddressBook } from "react-icons/fa";
import { TbMapPinCode } from "react-icons/tb";

export default function GetTenants() {
    const { currUser } = useSelector(state => state.user);
    const [tenants, setTenants] = useState([]);
    const [selectedTenant, setSelectedTenant] = useState(null);

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
        if(tenant) {
            if (selectedTenant && selectedTenant._id === tenant._id) {
                setSelectedTenant(null);
            } else {
                setSelectedTenant(tenant);
            }
        }else{
            setSelectedTenant(null);
        }
    };

    return (
        <>
            <ul className="my-4 space-y-3">
                {tenants && tenants.map(tenant => (
                    <li key={tenant._id} className="relative">
                        <a 
                            className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white cursor-pointer" 
                            onClick={() => toggleDropdown(tenant)}
                        >
                            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-400 rounded-full dark:bg-gray-800">
                                <span className="font-medium text-gray-200 dark:text-gray-300">
                                    {getProfileLetters(tenant.name)}
                                </span>
                            </div>
                            <span className="flex-1 ms-3">{tenant.name}</span>
                            <span className={`inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium rounded-sm ${tenant.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                {tenant.status}
                            </span>
                        </a>
                        {selectedTenant && selectedTenant._id === tenant._id && (
                            <div id="userDropdown" className="absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-52 dark:bg-gray-700 dark:divide-gray-600">
                                <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    <div>{selectedTenant.name}</div>
                                    <div className="font-medium truncate">{selectedTenant.email}</div>
                                </div>
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
                                    <li className="flex items-center px-4 gap-1 text-xs" >
                                        <FaPhoneAlt />
                                        <span className="block px-2 py-2">{ selectedTenant.contactInfo }</span>
                                    </li>
                                    <li className="flex items-center px-4 gap-1 text-xs" >
                                        <FaAddressBook />
                                        <span className="block px-2 py-2">{ selectedTenant.address }</span>
                                    </li>
                                    <li className="flex items-center px-4 gap-1 text-xs" >
                                        <TbMapPinCode />
                                        <span className="block px-2 py-2">{ selectedTenant.pinCode }</span>
                                    </li>
                                </ul>
                                <div className="py-1 cursor-pointer" onClick={()=> toggleDropdown()}>
                                    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Close</a>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
}
