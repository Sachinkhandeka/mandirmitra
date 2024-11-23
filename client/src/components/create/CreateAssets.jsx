import React, { useState } from 'react';
import { Button, Label, Select, TextInput, Textarea, Spinner } from 'flowbite-react';
import { MdAddHomeWork } from "react-icons/md";
import { GiKeyring } from "react-icons/gi";
import { HiOutlineCollection, HiOutlineDocumentText, HiOutlineCalendar, HiOutlineTag, 
    HiOutlineCurrencyRupee, HiOutlineLocationMarker, HiOutlineMap, HiOutlineStatusOnline } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import Alert from '../Alert';
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx"
import { useNavigate } from 'react-router-dom';

export default function AssetsForm() {
    const navigate = useNavigate()
    const { currUser } = useSelector(state => state.user);
    const [assetData, setAssetData] = useState({
        assetType: '',
        name: '',
        description: '',
        acquisitionDate: '',
        acquisitionCost: '',
        currentValue: '',
        address: '',
        pincode: '',
        status: '',
    });

    const [alert, setAlert] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAssetData({
            ...assetData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setAlert({ type: "", message: "" });
            setLoading(true);
            const data = await fetchWithAuth(
                `/api/asset/create/${currUser.templeId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(assetData),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate,
            );
            if(data) {
                setAlert({ type: "success", message: data.message });
                setLoading(false);
                setAssetData({
                    assetType: '',
                    name: '',
                    description: '',
                    acquisitionDate: '',
                    acquisitionCost: '',
                    currentValue: '',
                    address: '',
                    pincode: '',
                    status: '',
                });
            }
            
        } catch (err) {
            setAlert({ type: "error", message: err.message });
            setLoading(false);
        }
    };
    return (
        <div>
            <div className="w-full flex flex-col md:flex-row gap-4 border-2 border-gray-300 dark:border-gray-700 rounded-md my-10 relative">
                <div
                    className="min-h-20 md:min-h-full w-full md:w-40 flex md:flex-col 
                    justify-around items-center bg-gradient-to-bl from-blue-500 via-cyan-500 to-teal-500
                    dark:bg-gradient-to-bl dark:from-gray-600 dark:to-gray-800 rounded-tr-md 
                    md:rounded-tr-none rounded-tl-md md:rounded-bl-md"
                >
                    <div>
                        <MdAddHomeWork size={30} color="white" />
                    </div>
                    <div>
                        <GiKeyring size={30} color="white" />
                    </div>
                    <div>
                        <MdAddHomeWork size={30} color="white" />
                    </div>
                </div>
                <div className="flex-1 p-4 md:p-10">
                    <h2 
                        className="text-blue-400 dark:text-white font-mono uppercase font-bold p-2 mb-4 text-3xl bg-gradient-to-bl from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent"
                    >
                        Create Asset
                    </h2>
                    <form onSubmit={handleSubmit}>
                        {/* Asset Form Fields */}
                        <div className='flex flex-col md:flex-row gap-4'>
                            <div className="mb-4 w-full">
                                <Label htmlFor="assetType" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                    <HiOutlineCollection className="inline mr-2 text-xl text-gray-500" />
                                    Asset Type
                                </Label>
                                <Select id="assetType" name="assetType" value={assetData.assetType} onChange={handleChange} required>
                                    <option value="">Select an asset type</option>
                                    <option value="Land">Land</option>
                                    <option value="Building">Building</option>
                                    <option value="Shop">Shop</option>
                                    <option value="Rental Property">Rental Property</option>
                                    <option value="Vehicle">Vehicle</option>
                                    <option value="Jewelry">Jewelry</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Equipment">Equipment</option>
                                </Select>
                            </div>
                            <div className="mb-4 w-full">
                                <Label htmlFor="name" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                    <MdAddHomeWork className="inline mr-2 text-xl text-gray-500" />
                                    Name
                                </Label>
                                <TextInput id="name" name="name" type="text" placeholder="Enter asset name" value={assetData.name} onChange={handleChange} required />
                            </div>
                        </div>
                        {/* Additional Fields */}
                        <div className="mb-4">
                            <Label htmlFor="description" className="mb-4 text-sm font-medium flex items-center gap-2" > 
                                <HiOutlineDocumentText className="inline mr-2 text-xl text-gray-500" />
                                Description
                            </Label>
                            <Textarea id="description" name="description" value={assetData.description} onChange={handleChange} placeholder="Add a small description" rows="4" />
                            <span className="text-xs text-blue-600 dark:text-yellow-400">Optional</span>
                        </div>
                        {/* More Fields */}
                        <div className="mb-4 flex flex-col md:flex-row gap-4">
                            <div className="w-full">
                                <Label htmlFor="acquisitionDate" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                    <HiOutlineCalendar className="inline mr-2 text-xl text-gray-500" />
                                    Acquisition Date
                                </Label>
                                <TextInput id="acquisitionDate" name="acquisitionDate" type="date" value={assetData.acquisitionDate} onChange={handleChange} />
                                <span className="text-xs text-blue-600 dark:text-yellow-400">Optional</span>
                            </div>
                            <div className="w-full">
                                <Label htmlFor="acquisitionCost" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                    <HiOutlineTag className="inline mr-2 text-xl text-gray-500" />
                                    Acquisition Cost
                                </Label>
                                <TextInput id="acquisitionCost" name="acquisitionCost" type="number" placeholder="Enter acquisition cost" value={assetData.acquisitionCost} onChange={handleChange}/>
                                <span className="text-xs text-blue-600 dark:text-yellow-400">Optional</span>
                            </div>
                        </div>
                        <div className="mb-4 flex flex-col md:flex-row gap-4">
                            <div className="w-full">
                                <Label htmlFor="currentValue" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                    <HiOutlineCurrencyRupee className="inline mr-2 text-xl text-gray-500" />
                                    Current Value
                                </Label>
                                <TextInput id="currentValue" name="currentValue" type="number" placeholder="Enter current value" value={assetData.currentValue} onChange={handleChange}/>
                                <span className="text-xs text-blue-600 dark:text-yellow-400">Optional</span>
                            </div>
                        </div>
                        <div className="mb-4 flex flex-col md:flex-row gap-4">
                            <div className="w-full">
                                <Label htmlFor="address" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                    <HiOutlineLocationMarker className="inline mr-2 text-xl text-gray-500" />
                                    Address
                                </Label>
                                <TextInput id="address" name="address" type="text" placeholder="Enter address" value={assetData.address} onChange={handleChange} required />
                            </div>
                            <div className="w-full">
                                <Label htmlFor="pincode" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                    <HiOutlineMap className="inline mr-2 text-xl text-gray-500" />
                                    Pincode
                                </Label>
                                <TextInput id="pincode" name="pincode" type="text" placeholder="Enter pincode" value={assetData.pincode} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="status" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                <HiOutlineStatusOnline className="inline mr-2 text-xl text-gray-500" />
                                Status
                            </Label>
                            <Select id="status" name="status" value={assetData.status} onChange={handleChange} required>
                                <option value="">Select a status</option>
                                <option value="Active">Active</option>
                                <option value="Under Maintenance">Under Maintenance</option>
                                <option value="Inactive">Inactive</option>
                            </Select>
                        </div>
                        <div className="flex items-center justify-end">
                            <Button type="submit" gradientMonochrome={"cyan"}  pill disabled={loading}>
                                {loading ? <Spinner color={"success"} /> : 'Add Asset'}
                            </Button>
                        </div>
                    </form>
                </div>
                <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                    {alert.message && (
                        <Alert 
                           type={alert.type}
                           message={alert.message}
                           autoDismiss={true}
                           duration={6000}
                           onClose={()=> setAlert({ type : "", message : "" })}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
