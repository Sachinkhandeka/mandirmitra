import { Modal, Button, Label, Select, TextInput, Textarea, Spinner } from "flowbite-react";
import React, { useState } from 'react';
import { FaLuggageCart } from "react-icons/fa";
import { HiOutlineClipboardList, HiOutlineHashtag, HiOutlineCube, HiOutlineTag, HiOutlineCalculator, HiOutlineDocumentText  } from 'react-icons/hi';
import { BsFillBox2HeartFill, BsBoxFill } from "react-icons/bs";
import { useSelector } from 'react-redux';
import Alert from "../Alert";

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
                                <Label className="mb-4 text-sm font-medium flex items-center gap-2" htmlFor="name">
                                    <FaLuggageCart className="inline mr-2 text-xl text-gray-500" />
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
                                />
                            </div>
                            <div className="mb-4 w-full">
                                <Label className="mb-4 text-sm font-medium flex items-center gap-2" htmlFor="category">
                                    <HiOutlineClipboardList className="inline mr-2 text-xl text-gray-500" />
                                    Category
                                </Label>
                                <Select
                                    id="category"
                                    name="category"
                                    value={inventoryData.category}
                                    onChange={handleChange}
                                    required
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
                                <Label className="mb-4 text-sm font-medium flex items-center gap-2" htmlFor="quantity">
                                    <HiOutlineHashtag className="inline mr-2 text-xl text-gray-500" />
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
                                />
                            </div>
                            <div className="w-full">
                                <Label className="mb-4 text-sm font-medium flex items-center gap-2" htmlFor="unit">
                                    <HiOutlineCube className="inline mr-2 text-xl text-gray-500" />
                                    Unit
                                </Label>
                                <Select
                                    id="unit"
                                    name="unit"
                                    value={inventoryData.unit}
                                    onChange={handleChange}
                                    required
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
                                    <HiOutlineTag className="inline mr-2 text-xl text-gray-500" />
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
                                />
                            </div>
                            <div className="mb-4 w-full">
                                <Label className="mb-4 text-sm font-medium flex items-center gap-2" htmlFor="totalPrice">
                                    <HiOutlineCalculator className="inline mr-2 text-xl text-gray-500" />
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
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <Label className="mb-4 text-sm font-medium flex items-center gap-2" htmlFor="description">
                                <HiOutlineDocumentText className="inline mr-2 text-xl text-gray-500" />
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={inventoryData.description}
                                onChange={handleChange}
                                placeholder="Add a small description"
                                rows="4"
                            />
                        </div>
                        <div className="flex items-center justify-end">
                            <Button type="submit" gradientDuoTone="pinkToOrange" pill disabled={loading}>
                                {loading ? <Spinner color={"purple"} /> : 'Update'}
                            </Button>
                        </div>
                    </form>
                    <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                        {alert && alert.message && (
                            <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}