import { Button, Datepicker, Label, Select, Spinner, TextInput, Textarea } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { GiMoneyStack, GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import { Helmet } from "react-helmet-async";
import Alert from "../Alert";

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
                    { error && ( <Alert type="error" message={error} autoDismiss duration={6000} onClose={()=> setError(null)} />) }
                    { success && ( <Alert type="success" message={success} autoDismiss duration={6000} onClose={()=> setSuccess(null)} /> ) }
                </div>
                <h1 className="bg-gradient-to-bl from-pink-500 to-orange-500 bg-clip-text text-transparent dark:text-white font-mono uppercase font-bold p-2 mb-4 text-3xl flex gap-3">
                    Add Expense
                </h1>
                <form className="my-3" onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col gap-4 my-2 flex-1">
                            <Label htmlFor="title">Title</Label>
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
                            <Label htmlFor="date">Date</Label>
                            <Datepicker
                                weekStart={1}
                                id="date"
                                name="date"
                                onSelectedDateChanged={handleDatePickerChange}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 my-2">
                        <Label htmlFor="description">Description</Label>
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
                            <Label htmlFor="category">Category</Label>
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
                            <Label htmlFor="status">Status</Label>
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
                        <Label htmlFor="amount">Amount</Label>
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
                        <Button gradientDuoTone="pinkToOrange" pill onClick={handleSubmit} disabled={loading}>
                            { loading ? <Spinner color={"purple"} /> : "Add Expense" }
                        </Button>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
}
