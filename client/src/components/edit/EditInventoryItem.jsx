import { Modal, Button, Label, Select, TextInput, Textarea, Alert, Spinner } from "flowbite-react";
import React, { useState } from 'react';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { useSelector } from 'react-redux';

export default function EditInventoryItem({ editModal, setEditModal, inventory, setIsInventoryUpdated }) {
    const { currUser } = useSelector(state => state.user);
    const [inventoryData, setInventoryData] = useState({
        name: inventory.name || '',
        category: inventory.category || '',
        quantity: inventory.quantity || '',
        unit: inventory.unit || '',
        unitPrice: inventory.unitPrice || '',
        totalPrice: inventory.totalPrice || '',
        description: inventory.description || '',
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

    const handleSubmit = async(e)=> {
        e.preventDefault();
        setLoading(true);
        setAlert({ type : "", message : "" });
        try {
            const  response = await fetch(
                `/api/inventory/edit/${inventory._id}/${currUser.templeId}`,
                {
                    method : "PUT",
                    headers : { "content-type" : "application/json" },
                    body : JSON.stringify(inventoryData),
                }
            );
            const  data =  await response.json();

            if(!response.ok) {
                setAlert({ type : "error", message : data.message });
                setLoading(false);
                return ;
            }
            setAlert({ type : "success", message : "Inventory updated successfully" });
            setIsInventoryUpdated(true);
            setLoading(false);

        }catch(err) {
            setAlert({ type : "error", message : err.message });
            setLoading(false);
        }
    }

    return (
        <>
            <Modal show={editModal} dismissible onClose={()=> setEditModal(false)} >
                <Modal.Header className=" bg-gradient-to-tr from-sky-300 to-sky-600" >{ inventory.name }</Modal.Header>
                <Modal.Body>
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
                        <Alert color={alert.type === 'success' ? 'success' : 'failure'} icon={alert.type === 'success' ? AiOutlineCheckCircle : AiOutlineCloseCircle} className="my-4" onDismiss={()=> setAlert({ type : "", message : ""})}>
                            <span className="font-medium">
                                {alert.type === 'success' ? 'Success!' : 'Error!'}
                            </span> {alert.message}
                        </Alert>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}