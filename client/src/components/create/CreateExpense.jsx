import { Button, Datepicker, Label, Select, Spinner, TextInput, Checkbox } from "flowbite-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { GiMoneyStack, GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import { FaFileAlt, FaMoneyBillWave, FaClipboardCheck, FaListAlt, FaCalendarAlt } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";

export default function CreateExpense() {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type : "", message : "" });
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        date: "",
        category: "",
        status: "pending",
        event: null
    });
    const [events, setEvents] = useState([]);
    const [associateEvent, setAssociateEvent] = useState(false); // State to toggle event association

    // Predefined expense categories (following the enum from the schema)
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

    // Fetch events for the temple if associateEvent is true
    useEffect(() => {
        if (associateEvent) {
            const fetchEvents = async () => {
                try {
                    const data = await fetchWithAuth(
                        `/api/event/get/${currUser.templeId}`,
                        {},
                        refreshSuperAdminOrUserAccessToken,
                        "User",
                        setLoading,
                        setAlert,
                        navigate,
                    )
                    if(data) {
                        setEvents(data.events || []); // Set fetched events
                    }
                } catch (err) {
                    console.error(err);
                }
            };
            fetchEvents();
        }
    }, [associateEvent, currUser.templeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDatePickerChange = (date) => {
        setFormData({ ...formData, ["date"]: date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ type : "", message : "" });
        try {
            const data = await fetchWithAuth(
                `/api/expense/create/${currUser.templeId}`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(formData)
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
             if(data) {
                setLoading(false);
                setAlert({ type : "success", message : "Expense added successfully." });
                setFormData({
                    title: "",
                    amount: "",
                    date: "",
                    category: "",
                    status: "pending",
                    event: null
                });
                setAssociateEvent(false);
            }
        } catch (err) {
            setAlert({ type : "error", message : err.message });
        }
    };

    return (
        <>
            <Helmet>
                <title>Profile - {currUser.username}</title>
                <meta name="description" content="Add a new expense to your profile. Fill out the form with details such as title, description, amount, date, category, and status." />
            </Helmet>
            <div className="w-full flex flex-col md:flex-row gap-4 border-2 border-gray-300 dark:border-gray-700 rounded-md my-10 relative">
                <div
                    className="min-h-20 md:min-h-full w-full md:w-40 flex md:flex-col 
                    justify-around items-center bg-gradient-to-bl from-pink-500 to-orange-500
                    dark:bg-gradient-to-bl dark:from-gray-600 dark:to-gray-800 rounded-tr-md 
                    md:rounded-tr-none rounded-tl-md md:rounded-bl-md"
                >
                    <div><GiMoneyStack size={35} color="white" /></div>
                    <div><GiReceiveMoney size={35} color="white" /></div>
                    <div><GiTakeMyMoney size={35} color="white" /></div>
                </div>
                <div className="flex-1 p-4 md:p-10">
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
                    <h1 className="bg-gradient-to-bl from-pink-500 to-orange-500 bg-clip-text text-transparent dark:text-white font-mono uppercase font-bold p-2 mb-4 text-3xl flex gap-3">
                        Add Expense
                    </h1>
                    <form className="my-3" onSubmit={handleSubmit}>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex flex-col gap-4 my-2 flex-1">
                                <Label htmlFor="title" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                    <FaFileAlt className="inline mr-2 text-xl text-gray-500" />
                                    Title
                                </Label>
                                <TextInput
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Name of expense"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col gap-4 my-2 flex-1">
                                <Label htmlFor="date" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                    <FaCalendarAlt className="inline mr-2 text-xl text-gray-500" />
                                    Date
                                </Label>
                                <Datepicker
                                    weekStart={1}
                                    id="date"
                                    name="date"
                                    onSelectedDateChanged={handleDatePickerChange}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex flex-col gap-4 my-2 flex-1">
                                <Label htmlFor="category" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                    <FaListAlt className="inline mr-2 text-xl text-gray-500" />
                                    Category
                                </Label>
                                <Select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                </Select>
                            </div>
                            <div className="flex flex-col gap-4 my-2 flex-1">
                                <Label htmlFor="status" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                    <FaClipboardCheck className="inline mr-2 text-xl text-gray-500" />
                                    Status
                                </Label>
                                <Select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="completed">Completed</option>
                                    <option value="rejected">Rejected</option>
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 my-2">
                            <Label htmlFor="amount" className="mb-4 text-sm font-medium flex items-center gap-2" >
                                <FaMoneyBillWave className="inline mr-2 text-xl text-gray-500" />
                                Amount
                            </Label>
                            <TextInput
                                type="number"
                                id="amount"
                                name="amount"
                                placeholder="Amount spent"
                                value={formData.amount}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex items-center gap-2 my-4">
                            <Checkbox
                                id="associateEvent"
                                checked={associateEvent}
                                onChange={() => setAssociateEvent(!associateEvent)}
                            />
                            <Label htmlFor="associateEvent" className="text-sm font-medium">
                                Associate this expense with an event
                            </Label>
                        </div>
                        {associateEvent && (
                            <div className="flex flex-col gap-4 my-2">
                                <Label htmlFor="event" className="mb-4 text-sm font-medium flex items-center gap-2">
                                    <FaListAlt className="inline mr-2 text-xl text-gray-500" />
                                    Select Event
                                </Label>
                                <Select
                                    id="event"
                                    name="event"
                                    value={formData.event}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Event</option>
                                    {events.map(event => (
                                        <option key={event._id} value={event._id}>
                                            {event.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        )}
                        <div className="flex flex-row-reverse my-4">
                            <Button gradientDuoTone="pinkToOrange" pill onClick={handleSubmit} disabled={loading}>
                                {loading ? <Spinner color={"purple"} /> : "Add Expense"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
