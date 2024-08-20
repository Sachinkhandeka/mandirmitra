import { Button, Label, TextInput, Select, Datepicker, Spinner, Modal } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import Alert from  "../Alert";

export default function EditEvent({ editModal, setEditModal, setIsEventUpdated, name, date, location, status, id }) {
    const { currUser } = useSelector(state => state.user); // Add currUser to useSelector
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
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
        setSuccess(null);
        setError(null);
        setLoading(true);
        try {
            const response = await fetch(
                `/api/event/edit/${id}/${currUser.templeId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(eventData),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                return setError(data.message);
            }
            setSuccess("Event updated successfully!");
            setLoading(false);
            setIsEventUpdated(true); 
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    };

    return (
        <>
            <Helmet>
                <title>Edit Event - Temple Management</title>
                <meta name="description" content="Edit a event record in the temple management system. Update event details, address, and event information." />
            </Helmet>
            <Modal show={editModal} dismissible onClose={() => setEditModal(false)}>
                <Modal.Header>{ name }</Modal.Header>
                <Modal.Body>
                    <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                        {success && ( <Alert type="success" message={success} autoDismiss duration={6000} onClose={() => setSuccess(null)} /> )}
                        {error && ( <Alert type="error" message={error} autoDismiss duration={6000} onClose={() => setError(null)} /> )}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <Label htmlFor="name" className="mb-1 text-sm font-medium">
                                    Name of Event
                                </Label>
                                <TextInput
                                    type="text"
                                    className="p-2 border rounded-lg"
                                    id="name"
                                    name="name"
                                    value={eventData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <Label htmlFor="date" className="mb-1 text-sm font-medium">
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
                                    className="p-2 border rounded-lg"
                                />
                            </div>
                            <div className="flex flex-col">
                                <Label htmlFor="location" className="mb-1 text-sm font-medium">
                                    Location of Event
                                </Label>
                                <TextInput
                                    type="text"
                                    className="p-2 border rounded-lg"
                                    id="location"
                                    name="location"
                                    value={eventData.location}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col">
                                <Label htmlFor="status" className="mb-1 text-sm font-medium">
                                    Status
                                </Label>
                                <Select
                                    id="status"
                                    name="status"
                                    value={eventData.status}
                                    onChange={handleChange}
                                    className="p-2 border rounded-lg"
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
                                color={"warning"}
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
