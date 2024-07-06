import { Modal, Button, FloatingLabel, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { GoDash } from "react-icons/go";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function InventoryFilter({ isDrawerOpen, setIsDrawerOpen, setFilterCount }) {
    const { currUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const [minQuantity, setMinQuantity] = useState('');
    const [maxQuantity, setMaxQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [minUnitPrice, setMinUnitPrice] = useState('');
    const [maxUnitPrice, setMaxUnitPrice] = useState('');
    const [minTotalPrice, setMinTotalPrice] = useState('');
    const [maxTotalPrice, setMaxTotalPrice] = useState('');

    // Validate and set minQuantity
    const handleMinQuantityChange = (e) => {
        const quantity = e.target.value;
        if (/^\d+$/.test(quantity) && quantity.length <= 6) {
            setMinQuantity(quantity);
        }
    }

    // Validate and set maxQuantity
    const handleMaxQuantityChange = (e) => {
        const quantity = e.target.value;
        if (/^\d+$/.test(quantity) && quantity.length <= 6) {
            setMaxQuantity(quantity);
        }
    }

    // Validate and set minUnitPrice
    const handleMinUnitPriceChange = (e) => {
        const price = e.target.value;
        if (/^\d+$/.test(price) && price.length <= 6) {
            setMinUnitPrice(price);
        }
    }

    // Validate and set maxUnitPrice
    const handleMaxUnitPriceChange = (e) => {
        const price = e.target.value;
        if (/^\d+$/.test(price) && price.length <= 6) {
            setMaxUnitPrice(price);
        }
    }

    // Validate and set minTotalPrice
    const handleMinTotalPriceChange = (e) => {
        const price = e.target.value;
        if (/^\d+$/.test(price) && price.length <= 6) {
            setMinTotalPrice(price);
        }
    }

    // Validate and set maxTotalPrice
    const handleMaxTotalPriceChange = (e) => {
        const price = e.target.value;
        if (/^\d+$/.test(price) && price.length <= 6) {
            setMaxTotalPrice(price);
        }
    }

    // Handle apply filter functionality
    const handleSubmit = async (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        let filterCount = 0;

        if (category) {
            params.set("category", category);
            filterCount++;
        }
        if (minQuantity) {
            params.set("minQuantity", minQuantity);
            filterCount++;
        }
        if (maxQuantity) {
            params.set("maxQuantity", maxQuantity);
            filterCount++;
        }
        if (unit) {
            params.set("unit", unit);
            filterCount++;
        }
        if (minUnitPrice) {
            params.set("minUnitPrice", minUnitPrice);
            filterCount++;
        }
        if (maxUnitPrice) {
            params.set("maxUnitPrice", maxUnitPrice);
            filterCount++;
        }
        if (minTotalPrice) {
            params.set("minTotalPrice", minTotalPrice);
            filterCount++;
        }
        if (maxTotalPrice) {
            params.set("maxTotalPrice", maxTotalPrice);
            filterCount++;
        }

        const searchQuery = params.toString();
        setFilterCount(filterCount);
        navigate(`?tab=inventories&${searchQuery}`);
        setIsDrawerOpen(false);
    }

    // Handle clear all filters
    const handleClearFilters = () => {
        setCategory('');
        setMinQuantity('');
        setMaxQuantity('');
        setUnit('');
        setMinUnitPrice('');
        setMaxUnitPrice('');
        setMinTotalPrice('');
        setMaxTotalPrice('');
        navigate(`?tab=inventories`);
        setFilterCount(0); // Reset filter count
        setIsDrawerOpen(false);
    }

    return (
        <>
            <Modal show={isDrawerOpen} dismissible onClose={() => setIsDrawerOpen(false)} position="top-right">
                <Modal.Header>
                    <div className="flex gap-4 items-center">
                        <FaFilter size={24} className="mx-3" />
                        <h2 className="text-xl">Filters</h2>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        {/* Category Field */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-serif uppercase font-semibold">Category</h2>
                            <Select id="category" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Select Inventory Category">
                                <option value="">Select a category</option>
                                <option value="Ritual Supplies">Ritual Supplies</option>
                                <option value="Prasad Materials">Prasad Materials</option>
                                <option value="Cleaning Supplies">Cleaning Supplies</option>
                                <option value="Maintenance Supplies">Maintenance Supplies</option>
                                <option value="Administrative Supplies">Administrative Supplies</option>
                                <option value="Festival Supplies">Festival Supplies</option>
                            </Select>
                        </div>
                        {/* Quantity Range */}
                        <hr className="gray-400 my-3" />
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-serif uppercase font-semibold">Quantity Range</h2>
                            <div className="flex items-center justify-evenly gap-2">
                                <FloatingLabel type="number" id="minQuantity" value={minQuantity} variant="outlined" label="Minimum" onChange={handleMinQuantityChange} aria-labelledby="min-quantity-label" />
                                <GoDash size={20} />
                                <FloatingLabel type="number" id="maxQuantity" value={maxQuantity} variant="outlined" label="Maximum" onChange={handleMaxQuantityChange} aria-labelledby="max-quantity-label" />
                            </div>
                        </div>
                        {/* Unit Field */}
                        <hr className="gray-400 my-3" />
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-serif uppercase font-semibold">Unit</h2>
                            <Select id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} aria-label="Select Inventory Unit">
                                <option value="">Select a unit</option>
                                <option value="kg">Kilograms (kg)</option>
                                <option value="ltr">Liters (ltr)</option>
                                <option value="pcs">Pieces (pcs)</option>
                                <option value="other">Other</option>
                            </Select>
                        </div>
                        {/* Unit Price Range */}
                        <hr className="gray-400 my-3" />
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-serif uppercase font-semibold">Unit Price Range</h2>
                            <div className="flex items-center justify-evenly gap-2">
                                <FloatingLabel type="number" id="minUnitPrice" value={minUnitPrice} variant="outlined" label="Minimum" onChange={handleMinUnitPriceChange} aria-labelledby="min-unit-price-label" />
                                <GoDash size={20} />
                                <FloatingLabel type="number" id="maxUnitPrice" value={maxUnitPrice} variant="outlined" label="Maximum" onChange={handleMaxUnitPriceChange} aria-labelledby="max-unit-price-label" />
                            </div>
                        </div>
                        {/* Total Price Range */}
                        <hr className="gray-400 my-3" />
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-serif uppercase font-semibold">Total Price Range</h2>
                            <div className="flex items-center justify-evenly gap-2">
                                <FloatingLabel type="number" id="minTotalPrice" value={minTotalPrice} variant="outlined" label="Minimum" onChange={handleMinTotalPriceChange} aria-labelledby="min-total-price-label" />
                                <GoDash size={20} />
                                <FloatingLabel type="number" id="maxTotalPrice" value={maxTotalPrice} variant="outlined" label="Maximum" onChange={handleMaxTotalPriceChange} aria-labelledby="max-total-price-label" />
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer className="flex justify-between items-center">
                    <Button onClick={handleClearFilters} color={"gray"}>Clear All</Button>
                    <Button onClick={handleSubmit} color={"dark"}>Apply Filters</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
