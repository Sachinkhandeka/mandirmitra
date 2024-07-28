import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Datepicker, Label, Modal, Select, Spinner, TextInput, Textarea, Alert } from "flowbite-react";
import { Helmet } from "react-helmet-async";

export default function EditExpense({ showModal, setShowModal, setIsUpdated, expense }) {
    const { currUser } = useSelector(state => state.user);
    const [formData, setFormData] = useState({
        title : "",
        description : "",
        date : "",
        category : "",
        status : "",
        amount : 0,
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] =  useState(null);
    const [error, setError] = useState(null);

    useEffect(()=> {
        if(expense) {
            setFormData({
                ...formData,
                title: expense.title || '',
                description: expense.description || '',
                amount: expense.amount || '',
                date: expense.date|| '',
                category: expense.category || '',
                status: expense.status || 0,
            });
        }
    },[expense]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDatePickerChange = (date) => {
        setFormData({ ...formData, date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/expense/edit/${expense._id}/${currUser.templeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) {
                setLoading(false);
                return setError(data.message);
            }
            setLoading(false);
            setIsUpdated(true);
            setSuccess("Expense updated successfully.");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
        <Helmet>
                <title>Edit Expense - Temple Management</title>
                <meta name="description" content="Edit a expense record in the temple management system. Update expense details like title, description, date, category, status, and amount." />
        </Helmet>
        <Modal show={showModal} dismissible onClose={() => setShowModal(false)} position={"top-right"}>
            <Modal.Header>{expense.category}</Modal.Header>
            <Modal.Body className="bg-gradient-to-t from-yellow-100 to-yellow-400 dark:from-gray-600 dark:to-gray-800 p-4 flex-1" > 
                    {error && (<Alert onDismiss={() => setError(null)} color={"failure"} className="my-4">{error}</Alert>)}
                    {success && (<Alert onDismiss={() => setSuccess(null)} color={"success"} className="my-4 static">{success}</Alert>)}
                    <form className="my-3" onSubmit={handleSubmit}>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex flex-col gap-4 my-2 flex-1">
                                    <Label htmlFor="title" className="text-indigo-800">Title</Label>
                                    <TextInput
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-4 my-2 flex-1">
                                    <Label htmlFor="date" className="text-indigo-800">Date</Label>
                                    <Datepicker
                                        weekStart={1}
                                        id="date"
                                        name="date"
                                        value={new Date(formData.date).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: '2-digit',
                                            year: 'numeric',
                                        })}
                                        onSelectedDateChanged={handleDatePickerChange}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 my-2">
                                <Label htmlFor="description" className="text-indigo-800">Description</Label>
                                <Textarea
                                    type="text"
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex flex-col gap-4 my-2 flex-1">
                                    <Label htmlFor="category" className="text-indigo-800">Category</Label>
                                    <TextInput
                                        type="text"
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-4 my-2 flex-1">
                                    <Label htmlFor="status" className="text-indigo-800">Status</Label>
                                    <Select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="Select" disabled>Select</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="completed">Completed</option>
                                        <option value="rejected">Rejected</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 my-2">
                                <Label htmlFor="amount" className="text-indigo-800">Amount</Label>
                                <TextInput
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-row-reverse my-4">
                                <Button gradientMonochrome="purple" onClick={handleSubmit} disabled={loading}>
                                    {loading ? <Spinner color={"purple"} /> : "Update Expense"}
                                </Button>
                            </div>
                    </form>
            </Modal.Body>
        </Modal>
        </>
    );
}
