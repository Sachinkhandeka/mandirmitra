import { useSelector } from "react-redux";
import { Button, Card, Label, Modal, TextInput, Select, Alert, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

export default function EditAsset({ asset, isOpen, onClose, refreshAssets }) {
    const { currUser } = useSelector(state => state.user);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
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

    useEffect(() => {
        if (Object.keys(asset).length > 0) {
            setFormData({
                assetType: asset.assetType || '',
                name: asset.name || '',
                description: asset.description || '',
                acquisitionDate: asset.acquisitionDate ? new Date(asset.acquisitionDate).toISOString().split('T')[0] : '',
                acquisitionCost: asset.acquisitionCost.toString() || '',
                currentValue: asset.currentValue.toString() || '',
                address: asset.address || '',
                pincode: asset.pincode || '',
                status: asset.status || 'Active',
            });
        }
    }, [asset]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };
    const handleSubmit = async (e) => {
        setError(null);
        setSuccess(null);
        setLoading(true);
        e.preventDefault();
        try {
            const response = await fetch(`/api/asset/update/${currUser.templeId}/${asset._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                return setError(data.message);
            }
            setSuccess(data.message);
            setLoading(false);
            refreshAssets();
            onClose();
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    };

    return (
        <>
            <Helmet>
                <title>Edit Asset - Your Dashboard</title>
                <meta name="description" content="Edit asset details." />
            </Helmet>
            <Modal show={isOpen} size="xl" dismissible popup onClose={onClose}>
                <Modal.Header className="bg-gradient-to-r from-blue-400 to-blue-700 p-4 text-2xl font-bold text-gray-900 dark:text-white">
                    Edit Asset
                </Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        {error && (<Alert color={"failure"} onDismiss={() => setError(null)} className="sticky top-2 z-20">{error}</Alert>)}
                        {success && (<Alert color={"success"} onDismiss={() => setSuccess(null)} className="sticky top-2 z-20">{success}</Alert>)}
                        <form className="my-3" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-3 mt-2">
                                <Label htmlFor="assetType">Asset Type</Label>
                                <Select id="assetType" name="assetType" value={formData.assetType} onChange={handleChange} required>
                                    <option value="">Select Asset Type</option>
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
                            <div className="flex flex-col gap-3 mt-2">
                                <Label htmlFor="name">Name</Label>
                                <TextInput type="text" id="name" name="name" value={formData.name} placeholder="Enter asset name" onChange={handleChange} required />
                            </div>
                            <div className="flex flex-col gap-3 mt-2">
                                <Label htmlFor="description">Description</Label>
                                <TextInput type="text" id="description" name="description" value={formData.description} placeholder="Enter description" onChange={handleChange} />
                            </div>
                            <div className="flex flex-col gap-3 mt-2">
                                <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                                <TextInput type="date" id="acquisitionDate" name="acquisitionDate" value={formData.acquisitionDate} onChange={handleChange} />
                            </div>
                            <div className="flex flex-col gap-3 mt-2">
                                <Label htmlFor="acquisitionCost">Acquisition Cost</Label>
                                <TextInput type="number" id="acquisitionCost" name="acquisitionCost" value={formData.acquisitionCost} placeholder="Enter acquisition cost" onChange={handleChange} />
                            </div>
                            <div className="flex flex-col gap-3 mt-2">
                                <Label htmlFor="currentValue">Current Value</Label>
                                <TextInput type="number" id="currentValue" name="currentValue" value={formData.currentValue} placeholder="Enter current value" onChange={handleChange} />
                            </div>
                            <div className="flex flex-col gap-3 mt-2">
                                <Label htmlFor="address">Address</Label>
                                <TextInput type="text" id="address" name="address" value={formData.address} placeholder="Enter address" onChange={handleChange} required />
                            </div>
                            <div className="flex flex-col gap-3 mt-2">
                                <Label htmlFor="pincode">Pin Code</Label>
                                <TextInput type="text" id="pincode" name="pincode" value={formData.pincode} placeholder="Enter pin code" onChange={handleChange} required />
                            </div>
                            <div className="flex flex-col gap-3 mt-2">
                                <Label htmlFor="status">Status</Label>
                                <Select id="status" name="status" value={formData.status} onChange={handleChange} required>
                                    <option value="Active">Active</option>
                                    <option value="Under Maintenance">Under Maintenance</option>
                                    <option value="Inactive">Inactive</option>
                                </Select>
                            </div>
                            <button 
                                type="submit" 
                                className={`text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
                                    hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 
                                    dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                                    me-2 mt-4 mb-2`}
                                disabled={loading}
                            >
                                {loading ? <Spinner color={'blue'} /> : 'Update Asset'}
                            </button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
