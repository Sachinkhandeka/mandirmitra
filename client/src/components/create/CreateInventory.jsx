import { Button, Label, Select, TextInput, Textarea, Spinner } from 'flowbite-react';
import React, { useState } from 'react';
import { FaBoxes } from 'react-icons/fa';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import Alert from '../Alert';

export default function CreateInventory() {
    const { currUser } = useSelector(state => state.user);
    const [inventoryData, setInventoryData] = useState({
        name: '',
        category: '',
        quantity: '',
        unit: '',
        unitPrice: '',
        totalPrice: '',
        description: '',
    });

    const [alert, setAlert] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInventoryData({
            ...inventoryData,
            [name]: value,
            totalPrice: name === 'quantity' || name === 'unitPrice' ? calculateTotalPrice(inventoryData.quantity, inventoryData.unitPrice, name, value) : inventoryData.totalPrice
        });
    };

    const calculateTotalPrice = (quantity, unitPrice, name, value) => {
        if (name === 'quantity') {
            quantity = value;
        } else if (name === 'unitPrice') {
            unitPrice = value;
        }
        return quantity * unitPrice;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setAlert({ type: "", message: "" });
            setLoading(true);
            const response = await fetch(
                `/api/inventory/create/${currUser.templeId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(inventoryData),
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
            setInventoryData({
                name: '',
                category: '',
                quantity: '',
                unit: '',
                unitPrice: '',
                totalPrice: '',
                description: '',
            });
        } catch (err) {
            setAlert({ type: "error", message: err.message });
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="p-6 rounded-lg shadow-lg w-full dark:bg-slate-800">
                <div className="flex justify-center mb-4">
                    <FaBoxes className="text-4xl text-blue-500" />
                </div>
                <h2 className="text-2xl font-semibold text-center mb-6">Create Inventory Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className="mb-4 w-full">
                            <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Name
                            </Label>
                            <TextInput
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter inventory name"
                                value={inventoryData.name}
                                onChange={handleChange}
                                required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4 w-full">
                            <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                                Category
                            </Label>
                            <Select
                                id="category"
                                name="category"
                                value={inventoryData.category}
                                onChange={handleChange}
                                required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Select a category</option>
                                <option value="Ritual Supplies">Ritual Supplies</option>
                                <option value="Prasad Materials">Prasad Materials</option>
                                <option value="Cleaning Supplies">Cleaning Supplies</option>
                                <option value="Maintenance Supplies">Maintenance Supplies</option>
                                <option value="Administrative Supplies">Administrative Supplies</option>
                                <option value="Festival Supplies">Festival Supplies</option>
                            </Select>
                        </div>
                    </div>
                    <div className="mb-4 w-full flex flex-col md:flex-row gap-4">
                        <div className="w-full">
                            <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                                Quantity
                            </Label>
                            <TextInput
                                id="quantity"
                                name="quantity"
                                type="number"
                                placeholder="Enter Quantity"
                                value={inventoryData.quantity}
                                onChange={handleChange}
                                required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="w-full">
                            <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unit">
                                Unit
                            </Label>
                            <Select
                                id="unit"
                                name="unit"
                                value={inventoryData.unit}
                                onChange={handleChange}
                                required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Select a unit</option>
                                <option value="kg">Kilograms (kg)</option>
                                <option value="ltr">Liters (ltr)</option>
                                <option value="pcs">Pieces (pcs)</option>
                                <option value="other">Other</option>
                            </Select>
                        </div>
                    </div>
                    <div className='mb-4 flex items-center flex-col  md:flex-row gap-4' >
                        <div className="mb-4 w-full">
                            <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unitPrice">
                                Unit Price
                            </Label>
                            <TextInput
                                id="unitPrice"
                                name="unitPrice"
                                type="number"
                                placeholder="Enter unit price"
                                value={inventoryData.unitPrice}
                                onChange={handleChange}
                                required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4 w-full">
                            <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalPrice">
                                Total Price
                            </Label>
                            <TextInput
                                id="totalPrice"
                                name="totalPrice"
                                type="number"
                                placeholder="Enter total price"
                                value={inventoryData.totalPrice}
                                onChange={handleChange}
                                required
                                readOnly
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={inventoryData.description}
                            onChange={handleChange}
                            placeholder="Add a small description"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            rows="4"
                        />
                    </div>
                    <div className="flex items-center justify-end">
                        <Button type="submit" color={"blue"} disabled={loading}>
                            {loading ? <Spinner color={"purple"} /> : 'Create'}
                        </Button>
                    </div>
                </form>
                {alert.message && (
                    <Alert 
                        type={alert.type}
                        message={alert.message}
                        autoDismiss
                        duration={6000}
                    />
                )}
            </div>
        </div>
    );
}
