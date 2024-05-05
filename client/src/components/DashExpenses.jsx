import { Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TbFaceIdError } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";

const EditExpense = React.lazy(()=> import("./EditExpense"));

export default function DashExpenses() {
    const { currUser } = useSelector(state => state.user);
    const [expenses, setExpenses] = useState([]);
    const [ isUpdated, setIsUpdated ] = useState(false);
    const [ showModal, setShowModal ] = useState(false);
    const [ showDeleteModal, setShowDeleteModal ] = useState(false);
    const [ expense, setExpense ] = useState({});

    const getExpenses = async () => {
        try {
            const response = await fetch(`/api/expense/get/${currUser.templeId}`);
            const data = await response.json();

            if (!response.ok) {
                console.log(data.message);
                return;
            }
            setExpenses(data.allExpenses);
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        getExpenses();
    }, [currUser]);

    useEffect(() => {
        setIsUpdated(false);
        getExpenses();
    }, [isUpdated]);

    //handle edit functionality
    const handleEdit = (expense) => {
        setExpense(expense);
        setShowModal(true);
    }

    //handle delete functionality
    const handleDelete = (expense)=> {
        setExpense(expense);
        setShowDeleteModal(true);
    }

    //functionality to appply color to status dynamically
    const getStatusColor  = (status)=> {
        switch(status) {
            case "pending" :  return "text-yellow-500"
            case "approved" : return  "text-green-500"
            case "completed" : return  "text-blue-500"
            case "rejected" :  return "text-red-500"
            default : return ; 
        }
    }

    return (
        <>
            {expenses && expenses.length > 0 && (
                // Render the table if user is an admin or has permission to read expenses
                (currUser && currUser.isAdmin) ||
                (currUser.roles && currUser.roles.some(role => role.permissions.some(p => p.actions.includes("read"))))
            ) && (
                <Table striped>
                    <Table.Head>
                        <Table.HeadCell>Id</Table.HeadCell>
                        <Table.HeadCell>Date</Table.HeadCell>
                        <Table.HeadCell>Expense Title</Table.HeadCell>
                        <Table.HeadCell>Short Description</Table.HeadCell>
                        <Table.HeadCell>Category</Table.HeadCell>
                        <Table.HeadCell>Amount</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                        {/* Render actions if user is an admin or has permission to edit or delete expenses */}
                        {(currUser && currUser.isAdmin ||
                            (currUser.roles &&
                                currUser.roles.some(role =>
                                    role.permissions.some(p => p.actions.includes("update") || p.actions.includes("delete")))
                                )) && <Table.HeadCell>Actions</Table.HeadCell>}
                    </Table.Head>
                    <Table.Body>
                        {expenses.map(expense => (
                            <Table.Row key={expense._id}>
                                <Table.Cell>{expense._id}</Table.Cell>
                                <Table.Cell>{new Date(expense.date).toLocaleDateString()}</Table.Cell>
                                <Table.Cell>{expense.title}</Table.Cell>
                                <Table.Cell>{expense.description}</Table.Cell>
                                <Table.Cell>{expense.category}</Table.Cell>
                                <Table.Cell>{expense.amount}</Table.Cell>
                                <Table.Cell className={`${getStatusColor(expense.status)}`} >{expense.status}</Table.Cell>
                                {/* Render actions if user is an admin or has permission to edit or delete expenses */}
                                {(currUser && currUser.isAdmin ||
                                    (currUser.roles &&
                                        currUser.roles.some(role =>
                                            role.permissions.some(p => p.actions.includes("update") || p.actions.includes("delete")))
                                        )) && (
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
            )}

            {(!expenses || expenses.length === 0) && (
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
        </>
    );
}
