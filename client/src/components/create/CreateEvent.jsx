import { Button, Label, TextInput, Select, Datepicker, Spinner } from "flowbite-react";
import { FiCalendar, FiMapPin, FiFileText, FiCheckSquare } from "react-icons/fi";
import { SiEventbrite } from "react-icons/si";
import { FaPeopleGroup } from "react-icons/fa6";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";

export default function CreateEvent() {
    const { currUser } = useSelector((state) => state.user);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [eventData, setEventData] = useState({
        name: "",
        date: "",
        location: "",
        status: "pending",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDatePickerChange = (date) => {
        setEventData({ ...eventData, ["date"]: date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(null);
        setError(null);
        setLoading(true);
        try {
            const response = await fetch(
                `/api/event/create/${currUser.templeId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(eventData),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                return setError(data.message);
            }
            setSuccess("Event created successfully!");
            setLoading(false);
            setEventData({
                name: "",
                date: "",
                location: "",
                status: "pending",
            });
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    };

    return (
        <>
            <Helmet>
                <title>Profile - {currUser.username}</title>
                <meta name="description" content="Create a new event. Fill out the form with details such as event name, date, location, and status." />
            </Helmet>
            <div className="w-full my-8 flex flex-col items-center">
                <div className="w-full">
                    <div className="flex justify-center items-center">
                        <div className="w-full flex flex-col md:flex-row gap-4 border-2 border-gray-300 dark:border-gray-700 rounded-md my-10 relative">
                            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                                { error && ( <Alert type="error" message={error} autoDismiss duration={6000} onClose={()=> setError(null)} /> ) }
                                { success && ( <Alert type="success" message={success} autoDismiss duration={6000} onClose={()=> setSuccess(null)} /> ) }
                            </div>
                            <div
                                className="min-h-20 md:min-h-full w-full md:w-40 flex md:flex-col 
                                justify-around items-center bg-gradient-to-bl from-blue-500 to-purple-600
                                dark:bg-gradient-to-bl dark:from-gray-600 dark:to-gray-800 rounded-tr-md 
                                md:rounded-tr-none rounded-tl-md md:rounded-bl-md"
                            >
                                <div><SiEventbrite size={30} color="white" /></div>
                                <div><FaPeopleGroup size={30} color="white" /></div>
                                <div><SiEventbrite size={30} color="white" /></div>
                            </div>
                            <div className="flex-1 p-4 md:p-10">
                                <h1 className="text-blue-400 dark:text-white font-mono uppercase font-bold p-2 mb-4 text-3xl">
                                    Create Event
                                </h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <Label htmlFor="name" className="mb-4 text-sm font-medium flex items-center gap-2">
                                                <FiFileText className="inline mr-2 text-xl text-gray-500" />
                                                Name of Event
                                            </Label>
                                            <TextInput
                                                type="text"
                                                id="name"
                                                name="name"
                                                placeholder="Add Event Name"
                                                value={eventData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <Label htmlFor="date" className="mb-4 text-sm font-medium flex items-center gap-2">
                                                <FiCalendar className="inline mr-2 text-xl text-gray-500" />
                                                Date
                                            </Label>
                                            <Datepicker
                                                weekStart={1}
                                                id="date"
                                                name="date"
                                                onSelectedDateChanged={handleDatePickerChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <Label htmlFor="location" className="mb-4 text-sm font-medium flex items-center gap-2">
                                                <FiMapPin className="inline mr-2 text-xl text-gray-500" />
                                                Location of Event
                                            </Label>
                                            <TextInput
                                                type="text"
                                                id="location"
                                                name="location"
                                                placeholder="Add Event Location"
                                                value={eventData.location}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <Label htmlFor="status" className="mb-4 text-sm font-medium flex items-center gap-2">
                                                <FiCheckSquare className="inline mr-2 text-xl text-gray-500" />
                                                Status
                                            </Label>
                                            <Select
                                                id="status"
                                                name="status"
                                                value={eventData.status}
                                                onChange={handleChange}
                                            >
                                                <option value="Select" disabled>
                                                    Select
                                                </option>
                                                <option value="pending">Pending</option>
                                                <option value="completed">Completed</option>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-6 gap-4">
                                        <Button
                                            type="submit"
                                            gradientDuoTone="purpleToBlue"
                                            pill
                                            disabled={loading}
                                        >
                                            { loading ? <Spinner color={"warning"} />  : "Create" }
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
