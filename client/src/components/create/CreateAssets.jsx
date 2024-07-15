import React, { useState } from 'react';
import { Button, Label, Select, TextInput, Textarea, Alert, Spinner } from 'flowbite-react';
import { FaLandmark } from 'react-icons/fa';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { useSelector } from 'react-redux';

export default function AssetsForm() {
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
            const response = await fetch(
                `/api/asset/create/${currUser.templeId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(assetData),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                setAlert({ type: "error", message: data.message });
                setLoading(false);
                return;
            }

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
            
        } catch (err) {
            setAlert({ type: "error", message: err.message });
            setLoading(false);
        }
    };
    return (
        <div>
            <div className="p-6 rounded-lg shadow-lg w-full my-6 dark:bg-slate-800">
                <div className="flex justify-center mb-4">
                    <FaLandmark className="text-4xl text-green-500" />
                </div>
                <h2 className="text-2xl font-semibold text-center mb-6">Create Asset</h2>
                <form onSubmit={handleSubmit}>
                    {/* Asset Form Fields */}
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className="mb-4 w-full">
                            <Label htmlFor="assetType">Asset Type</Label>
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
                            <Label htmlFor="name">Name</Label>
                            <TextInput id="name" name="name" type="text" placeholder="Enter asset name" value={assetData.name} onChange={handleChange} required />
                        </div>
                    </div>
                    {/* Additional Fields */}
                    <div className="mb-4">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={assetData.description} onChange={handleChange} placeholder="Add a small description" rows="4" />
                        <span className="text-xs text-blue-600 dark:text-yellow-400">Optional</span>
                    </div>
                    {/* More Fields */}
                    <div className="mb-4 flex flex-col md:flex-row gap-4">
                        <div className="w-full">
                            <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                            <TextInput id="acquisitionDate" name="acquisitionDate" type="date" value={assetData.acquisitionDate} onChange={handleChange} />
                            <span className="text-xs text-blue-600 dark:text-yellow-400">Optional</span>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="acquisitionCost">Acquisition Cost</Label>
                            <TextInput id="acquisitionCost" name="acquisitionCost" type="number" placeholder="Enter acquisition cost" value={assetData.acquisitionCost} onChange={handleChange}/>
                            <span className="text-xs text-blue-600 dark:text-yellow-400">Optional</span>
                        </div>
                    </div>
                    <div className="mb-4 flex flex-col md:flex-row gap-4">
                        <div className="w-full">
                            <Label htmlFor="currentValue">Current Value</Label>
                            <TextInput id="currentValue" name="currentValue" type="number" placeholder="Enter current value" value={assetData.currentValue} onChange={handleChange}/>
                            <span className="text-xs text-blue-600 dark:text-yellow-400">Optional</span>
                        </div>
                    </div>
                    <div className="mb-4 flex flex-col md:flex-row gap-4">
                        <div className="w-full">
                            <Label htmlFor="address">Address</Label>
                            <TextInput id="address" name="address" type="text" placeholder="Enter address" value={assetData.address} onChange={handleChange} required />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="pincode">Pincode</Label>
                            <TextInput id="pincode" name="pincode" type="text" placeholder="Enter pincode" value={assetData.pincode} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="status">Status</Label>
                        <Select id="status" name="status" value={assetData.status} onChange={handleChange} required>
                            <option value="">Select a status</option>
                            <option value="Active">Active</option>
                            <option value="Under Maintenance">Under Maintenance</option>
                            <option value="Inactive">Inactive</option>
                        </Select>
                    </div>
                    <div className="flex items-center justify-end">
                        <Button type="submit" color={"green"} disabled={loading}>
                            {loading ? <Spinner color={"success"} /> : 'Create'}
                        </Button>
                    </div>
                </form>
                {alert.message && (
                    <Alert color={alert.type === 'success' ? 'success' : 'failure'} icon={alert.type === 'success' ? AiOutlineCheckCircle : AiOutlineCloseCircle} className="my-4" onDismiss={() => setAlert({ type: "", message: "" })}>
                        <span className="font-medium">
                            {alert.type === 'success' ? 'Success!' : 'Error!'}
                        </span> {alert.message}
                    </Alert>
                )}
            </div>
        </div>
    );
}
