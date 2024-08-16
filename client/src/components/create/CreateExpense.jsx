<<<<<<< HEAD
import { Button, Datepicker, Label, Select, Spinner, TextInput, Textarea } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";
=======
import { Alert, Button, Datepicker, Label, Select, Spinner, TextInput, Textarea } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
>>>>>>> 1ec6c1190f4d0e1f435a1159826a6485d909f462

export default function CreateExpense() {
    const { currUser } = useSelector(state => state.user);
    const [ loading, setLoading ] = useState(false);
    const [ success , setSuccess ] = useState(null);
    const [ error, setError ] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        amount: "",
        date: "",
        category: "",
        status: "pending" // Default status
    });

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
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch(`/api/expense/create/${currUser.templeId}`, {
                method: "POST",
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
            setSuccess("Expense added successfully.");
            setFormData({
                title: "",
                description: "",
                amount: "",
                date: "",
                category: "",
                status: "pending"
            });
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <>
        <Helmet>
            <title>Create Expense - Your Dashboard</title>
            <meta name="description" content="Add a new expense to your profile. Fill out the form with details such as title, description, amount, date, category, and status." />
        </Helmet>
        <div className="w-full border rounded-md p-2 md:p-4 my-4 flex gap-4">
            <div className="w-10 bg-yellow-300 dark:bg-gray-700 hidden md:block"></div>
            <div className="bg-gradient-to-t from-yellow-100 to-yellow-400 dark:from-gray-600 dark:to-gray-800 mx-1 md:mx-4 p-4 flex-1">
<<<<<<< HEAD
                { error && ( <Alert type="error" message={error} autoDismiss duration={6000} />) }
                { success && ( <Alert type="success" message={success} autoDismiss duration={6000} /> ) }
=======
                { error && ( <Alert onDismiss={()=> setError(null)} color={"failure"} className="my-4 fixed bottom-4 right-4 z-40">{error}</Alert> ) }
                { success && ( <Alert onDismiss={()=> setSuccess(null)} color={"success"} className="my-4 fixed bottom-4 right-4 z-40">{success}</Alert> ) }
>>>>>>> 1ec6c1190f4d0e1f435a1159826a6485d909f462
                <h1 className="text-2xl font-serif uppercase font-bold text-indigo-800 dark:text-white">Add Expense</h1>
                <form className="my-3" onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col gap-4 my-2 flex-1">
                            <Label htmlFor="title" className="text-indigo-800">Title</Label>
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
                            <Label htmlFor="date" className="text-indigo-800">Date</Label>
                            <Datepicker
                                weekStart={1}
                                id="date"
                                name="date"
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
                            placeholder="Small description about expense"
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
                                placeholder="Expense category"
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
                            placeholder="Amount spend/Expense amount"
                            value={formData.amount}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-row-reverse my-4">
                        <Button gradientMonochrome="purple" onClick={handleSubmit} disabled={loading}>
                            { loading ? <Spinner color={"purple"} /> : "Add Expense" }
                        </Button>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
}
