import { Modal, Button, FloatingLabel, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { GoDash } from "react-icons/go";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ExpenseFilter({ isDrawerOpen, setIsDrawerOpen, filterCount, setFilterCount }) {
    const { currUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [ category, setCategory ] = useState('');
    const [ minAmount, setMinAmount ] = useState('');
    const [ maxAmount, setMaxAmount ] = useState('');
    const [ status, setStatus ] = useState('');

    // Validate and set minAmount
    const handleMinAmountChange = (e) => {
        const amount = e.target.value;
        if (/^\d+$/.test(amount) && amount.length <= 6) {
            setMinAmount(amount);
        }
    }

    // Validate and set maxAmount
    const handleMaxAmountChange = (e) => {
        const amount = e.target.value;
        if (/^\d+$/.test(amount) && amount.length <= 6) {
            setMaxAmount(amount);
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
        if (minAmount) {
            params.set("minAmount", minAmount);
            filterCount++;
        }
        if (maxAmount) {
            params.set("maxAmount", maxAmount);
            filterCount++;
        }
        if (status) {
            params.set("status", status);
            filterCount++;
        }

        const searchQuery = params.toString();
        setFilterCount(filterCount);
        navigate(`?tab=expenses&${searchQuery}`);
        setIsDrawerOpen(false);
    }

    // Handle clear all filters
    const handleClearFilters = () => {
        setCategory('');
        setMinAmount('');
        setMaxAmount('');
        setStatus('');
        navigate(`?tab=expenses`);
        setFilterCount(0); // Reset filter count
        setIsDrawerOpen(false);
    }

    return (
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
                        <FloatingLabel type="text" id="category" value={category} variant="outlined" label="Category" onChange={(e)=> setCategory(e.target.value)} />
                    </div>
                    {/* Status Field */}
                    <hr className="gray-400 my-3" />
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-serif uppercase font-semibold">Status</h2>
                        <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">Select</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">Rejected</option>
                        </Select>
                    </div>
                    {/* Price Range */}
                    <hr className="gray-400 my-3" />
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-serif uppercase font-semibold">Price Range</h2>
                        <div className="flex items-center justify-evenly gap-2">
                            <FloatingLabel type="number" id="minAmount" value={minAmount} variant="outlined" label="Minimum" onChange={handleMinAmountChange} />
                            <GoDash size={20} />
                            <FloatingLabel type="number" id="maxAmount" value={maxAmount} variant="outlined" label="Maximum" onChange={handleMaxAmountChange} />
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer className="flex justify-between items-center">
                <Button onClick={handleClearFilters} color={"gray"}>Clear All</Button>
                <Button onClick={handleSubmit} color={"dark"}>Apply Filters</Button>
            </Modal.Footer>
        </Modal>
    );
}
