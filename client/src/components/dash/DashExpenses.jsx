import { Table, Pagination, Tooltip, Button } from "flowbite-react";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { TbFaceIdError } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { IoFilterCircleOutline } from "react-icons/io5";
import { Helmet } from "react-helmet-async";
import { debounce } from "lodash";
import ExpenseSummary from "../ExpenseSummary";

const EditExpense = React.lazy(()=> import("../edit/EditExpense"));
const DeleteExpense = React.lazy(()=> import("../delete/DeleteExpense"));
const ExpenseFilter = React.lazy(()=> import("../ExpenseFilter"));

export default function DashExpenses() {
    const { searchTerm } = useSelector(state=> state.searchTerm);
    const { currUser } = useSelector(state => state.user);
    const location = useLocation();
    const [ expenses, setExpenses] = useState([]);
    const [ totalExpenses, setTotalExpenses ] = useState(null);
    const [ isUpdated, setIsUpdated ] = useState(false);
    const [ showModal, setShowModal ] = useState(false);
    const [ showDeleteModal, setShowDeleteModal ] = useState(false);
    const [ expense, setExpense ] = useState({});
    const [ expenseId, setExpenseId ] = useState("");
    const [ currPage, setCurrPage ] = useState(1);
    const [ isDrawerOpen , setIsDrawerOpen ] = useState(false);
    const [ filterCount, setFilterCount ] = useState(0);

    const onPageChange = (page)=> setCurrPage(page);
    const queryParams = new URLSearchParams(location.search);

    const getExpenses = async () => {
        const tab  = queryParams.get("tab");

        // Conditionally include searchTerm only when tab is 'expenses'
        const searchParam = tab === 'expenses' ? `&searchTerm=${searchTerm}` : '';
       
        try {
            const response = await fetch(
                `/api/expense/get/${currUser.templeId}${queryParams ? '?' + queryParams.toString() : ''}${searchParam}`
            );
            const data = await response.json();

            if (!response.ok) {
                console.log(data.message);
                return;
            }
            setExpenses(data.allExpenses);
            setTotalExpenses(data.totalExpenses);
        } catch (err) {
            console.log(err.message);
        }
    };

    // Debounce fetchExpenses function
    const debouncedFetchExpense = useCallback(debounce(getExpenses,500),[currUser, location.search, searchTerm]);

    useEffect(() => {
        debouncedFetchExpense();
    }, [currUser, location.search, searchTerm ]);

    useEffect(() => {
        setIsUpdated(false);
        debouncedFetchExpense();
    }, [isUpdated]);

    // Handle edit functionality
    const handleEdit = (expense) => {
        setExpense(expense);
        setShowModal(true);
    }

    // Handle delete functionality
    const handleDelete = (expense)=> {
        setExpenseId(expense._id);
        setShowDeleteModal(true);
    }

    // Functionality to apply color to status dynamically
    const getStatusColor  = (status)=> {
        switch(status) {
            case "pending" :  return "bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300"
            case "completed" : return  "bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400"
            case "approved" : return  "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400"
            case "rejected" :  return "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400"
            default : return ; 
        }
    }

    return (
        <>
            <Helmet>
                <title>Manage Temple Expenses - Dashboard</title>
                <meta name="description" content="View and manage expenses for your temple. Edit or delete expenses as needed." />
            </Helmet>
            
            {/* Drawer toggler */}
            {currUser && (currUser.isAdmin || currUser.roles.some(role => role.permissions.some(p => p.actions.includes("read")))) && (
                <div className="mb-3 flex flex-row-reverse sticky left-0 my-4 z-20">
                    <Tooltip content={`${filterCount} filters applied`} placement="left">
                        <Button color={"red"} onClick={()=> setIsDrawerOpen(true)} >
                            <IoFilterCircleOutline className="mr-2 h-5 w-5" />
                            Filters
                        </Button>
                    </Tooltip>
                </div>
            )}
            
            {/* Drawer */}
            { isDrawerOpen && currUser && (currUser.isAdmin || currUser.roles.some(role => role.permissions.some(p => p.actions.includes("read")))) && (
                <ExpenseFilter 
                    isDrawerOpen={isDrawerOpen}
                    setIsDrawerOpen={setIsDrawerOpen}
                    filterCount={filterCount}
                    setFilterCount={setFilterCount}
                />
            )}
            
            {/* Pagination */}
            { totalExpenses && totalExpenses > 20 && currUser && (currUser.isAdmin || currUser.roles.some(role => role.permissions.some(p => p.actions.includes("read")))) && (
                <div className="flex overflow-x-auto sm:justify-center mb-5 sticky left-0">
                    <Pagination currentPage={currPage} totalPages={Math.ceil(totalExpenses / 20)} onPageChange={onPageChange} showIcons />
                </div>
            )}
            
            { expenses && expenses.length > 0 && (currUser.isAdmin || currUser.roles.some(role => role.permissions.some(p => p.actions.includes("read") || p.actions.includes("update") || p.actions.includes("delete")))) && (
                <>
                <Table striped>
                    <Table.Head>
                        <Table.HeadCell>Date</Table.HeadCell>
                        <Table.HeadCell>Expense Title</Table.HeadCell>
                        <Table.HeadCell>Category</Table.HeadCell>
                        <Table.HeadCell>Short Description</Table.HeadCell>
                        <Table.HeadCell>Amount</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                        <Table.HeadCell>Event</Table.HeadCell>
                        {/* Render actions if user is an admin or has permission to edit or delete expenses */}
                        {currUser && (currUser.isAdmin || currUser.roles.some(role => role.permissions.some(p => p.actions.includes("update") || p.actions.includes("delete")))) && (
                            <Table.HeadCell>Actions</Table.HeadCell>
                        )}
                    </Table.Head>
                    <Table.Body>
                        { expenses && expenses.length > 0 && expenses.slice((currPage - 1) * 20, currPage * 20).map(expense => (
                            <Table.Row key={expense._id}>
                                <Table.Cell>{new Date(expense.date).toLocaleDateString()}</Table.Cell>
                                <Table.Cell>{expense.title}</Table.Cell>
                                <Table.Cell>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                        {expense.category}
                                    </span>
                                </Table.Cell>
                                <Table.Cell>{expense.description}</Table.Cell>
                                <Table.Cell>
                                    {expense.amount ? parseFloat(expense.amount).toLocaleString('en-IN', { maximumFractionDigits: 2, style: 'currency', currency: 'INR' }) : ''}
                                </Table.Cell>
                                <Table.Cell>
                                    <span className={getStatusColor(expense.status)}>
                                        {expense.status}
                                    </span>
                                </Table.Cell>
                                <Table.Cell>{expense.event ? expense.event.name : 'N/A'}</Table.Cell>
                                {(currUser && currUser.isAdmin ||
                                    (currUser.roles &&
                                        currUser.roles.some(role =>
                                            role.permissions.some(p => p.actions.includes("update") || p.actions.includes("delete"))))
                                    ) && (
                                    <Table.Cell>
                                        <div className="flex justify-between items-center gap-4" >
                                            { 
                                                // Render edit icon if user is admin or has permission to edit expense
                                                (currUser && currUser.isAdmin ||
                                                (currUser.roles && currUser.roles.some(role => role.permissions.some(p => p.actions.includes("update"))))) && (
                                                    <span className="cursor-pointer" >
                                                        <FaPencil onClick={() => handleEdit(expense)} size={16} color="teal"/>
                                                    </span>
                                                )
                                            }
                                            { 
                                                // Render delete icon if user is admin or has permission to delete expense
                                                (currUser && currUser.isAdmin ||
                                                (currUser.roles && currUser.roles.some(role => role.permissions.some(p => p.actions.includes("delete"))))) && (
                                                    <span className="cursor-pointer" >
                                                        <MdDelete onClick={() => handleDelete(expense)} size={20} color="red"/>
                                                    </span>
                                                )
                                            }
                                        </div>
                                    </Table.Cell>
                                )}
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                <ExpenseSummary expenses={expenses} />
                </>
            )}
            
            { totalExpenses && totalExpenses > 20 && currUser && (currUser.isAdmin || currUser.roles.some(role => role.permissions.some(p => p.actions.includes("read")))) && (
                <div className="flex overflow-x-auto sm:justify-center mb-5 sticky left-0">
                    <Pagination currentPage={currPage} totalPages={Math.ceil(totalExpenses / 20)} onPageChange={onPageChange} showIcons />
                </div>
            )}
            
            { (!expenses || expenses.length === 0) && (
                <div className="flex justify-center items-center h-screen">
                    <div className="text-center flex flex-col items-center justify-center">
                        <TbFaceIdError size={50} className="animate-bounce" />
                        <p>No Expenses Added Yet!</p>
                    </div>
                </div>
            )}        
            <EditExpense
                showModal={showModal}
                setShowModal={setShowModal}
                setIsUpdated={setIsUpdated}
                expense={expense}
            />
            <DeleteExpense
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                setIsUpdated={setIsUpdated}
                expenseId={expenseId}
            />
        </>
    );
}
