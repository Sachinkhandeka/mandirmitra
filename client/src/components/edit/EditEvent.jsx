import { Button, Label, TextInput, Select, Datepicker, Spinner, Modal } from "flowbite-react";
import { FiCalendar, FiMapPin, FiFileText, FiCheckSquare } from "react-icons/fi";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import Alert from  "../Alert";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";

export default function EditEvent({ editModal, setEditModal, setIsEventUpdated, name, date, location, status, id }) {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user); // Add currUser to useSelector
    const [alert, setAlert] = useState({ type : "", message : "" });
    const [loading, setLoading] = useState(false);
    const [eventData, setEventData] = useState({
        name: name,
        date: new Date(date),
        location: location,
        status: status,
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
        setAlert({ type : "", message : "" });
        setLoading(true);
        try {
            const data = await fetchWithAuth(
                `/api/event/edit/${id}/${currUser.templeId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(eventData),
                },
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setAlert({ type : "success", message : "Event updated successfully!" });
                setLoading(false);
                setIsEventUpdated(true); 
            }
        } catch (err) {
            setLoading(false);
            setAlert({ type : "error", message : err.message });
        }
    };

    return (
        <>
            <Helmet>
                <title>Edit Event - Temple Management</title>
                <meta name="description" content="Edit a event record in the temple management system. Update event details, address, and event information." />
            </Helmet>
            <Modal show={editModal} dismissible onClose={() => setEditModal(false)}>
                <Modal.Header className="bg-gradient-to-r from-blue-500 to-purple-600" >
                    <div className="text-white uppercase font-bold" >{ name }</div>
                </Modal.Header>
                <Modal.Body>
                    <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                        {alert && alert.message && (
                            <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                        )}
                    </div>
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
                                    value={new Date(eventData.date).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: '2-digit',
                                        year: 'numeric',
                                    })}
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
                        <div className="flex justify-end mt-6">
                            <Button
                                type="submit"
                                gradientDuoTone="purpleToBlue"
                                pill
                                disabled={loading}
                            >
                                {loading ? <Spinner color={"warning"} /> : "Edit Event"}
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
}
