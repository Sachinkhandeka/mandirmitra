import { Modal, Button, Select } from "flowbite-react";
import { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import { GoDash } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";

export default function ExpenseFilter({ isDrawerOpen, setIsDrawerOpen, setFilterCount }) {
    const { currUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [category, setCategory] = useState('');  // Updated category state
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [status, setStatus] = useState('');
    const [event, setEvent] = useState('');  // Event state for filtering
    const [events, setEvents] = useState([]); // Store list of events

    // Predefined categories for filtering
    const categories = [
        "Rituals & Poojas",
        "Festivals & Events",
        "Maintenance & Repairs",
        "Utilities",
        "Staff Salaries",
        "Charity & Donations",
        "Food & Prasadam",
        "Decorations & Flowers",
        "Security",
        "Miscellaneous"
    ];

    // Fetch list of events when the component mounts
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`/api/event/get/${currUser.templeId}`); // Adjust API endpoint accordingly
                const data = await response.json();
                setEvents(data.events); // Set fetched events
            } catch (err) {
                console.error("Error fetching events:", err);
            }
        };

        fetchEvents();
    }, [currUser.templeId]);

    // Validate and set minAmount
    const handleMinAmountChange = (e) => {
        const amount = e.target.value;
        if (/^\d+$/.test(amount) && amount.length <= 6) {
            setMinAmount(amount);
        }
    };

    // Validate and set maxAmount
    const handleMaxAmountChange = (e) => {
        const amount = e.target.value;
        if (/^\d+$/.test(amount) && amount.length <= 6) {
            setMaxAmount(amount);
        }
    };

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
        if (event) {  // Include event in the filter
            params.set("event", event);
            filterCount++;
        }

        const searchQuery = params.toString();
        setFilterCount(filterCount);
        navigate(`?tab=expenses&${searchQuery}`);
        setIsDrawerOpen(false);
    };

    // Handle clear all filters
    const handleClearFilters = () => {
        setCategory('');
        setMinAmount('');
        setMaxAmount('');
        setStatus('');
        setEvent(''); // Reset event filter
        navigate(`?tab=expenses`);
        setFilterCount(0); // Reset filter count
        setIsDrawerOpen(false);
    };

    return (
        <>
            <Helmet>
                <title>Expense Filters</title>
                <meta name="description" content="Apply filters to manage expenses based on category, amount, and status." />
            </Helmet>
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
                            <Select id="category" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Select Category">
                                <option value="">Select Category</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>{cat}</option>
                                ))}
                            </Select>
                        </div>

                        {/* Event Field */}
                        <hr className="gray-400 my-3" />
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-serif uppercase font-semibold">Event</h2>
                            <Select id="event" value={event} onChange={(e) => setEvent(e.target.value)} aria-label="Select Event">
                                <option value="">Select Event</option>
                                {events.map(event => (
                                    <option key={event._id} value={event._id}>
                                        {event.name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Status Field */}
                        <hr className="gray-400 my-3" />
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-serif uppercase font-semibold">Status</h2>
                            <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Select Expense Status">
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
                                <input
                                    type="number"
                                    id="minAmount"
                                    value={minAmount}
                                    onChange={handleMinAmountChange}
                                    placeholder="Minimum"
                                    className="border rounded-lg p-2 w-full"
                                />
                                <GoDash size={20} />
                                <input
                                    type="number"
                                    id="maxAmount"
                                    value={maxAmount}
                                    onChange={handleMaxAmountChange}
                                    placeholder="Maximum"
                                    className="border rounded-lg p-2 w-full"
                                />
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
