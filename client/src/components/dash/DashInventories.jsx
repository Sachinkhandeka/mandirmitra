import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TbFaceIdError } from "react-icons/tb";
import { AiOutlineWarning, AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { Alert, Table } from "flowbite-react";
import { FaPencil } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

const EditInventoryItem = React.lazy(()=> import("../edit/EditInventoryItem"));

export default function DashInventories() {
    const { currUser } = useSelector(state => state.user);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [inventories, setInventories] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [inventory, setInventory] =  useState({});
    const [isInvetoryUpdated, setIsInventoryUpdated] = useState(false);

    const getInventoriesData = async () => {
        setAlert({ type: "", message: "" });
        try {
            const response = await fetch(`/api/inventory/get/${currUser.templeId}`);
            const data = await response.json();

            if (!response.ok) {
                setAlert({ type: "error", message: data.message });
                return;
            }

            const sortedInventories = data.inventoryItems.sort((a, b) => {
                if (a.quantity === 0) return -1;
                if (b.quantity === 0) return 1;
                if (a.quantity < 5 && b.quantity >= 5) return -1;
                if (b.quantity < 5 && a.quantity >= 5) return 1;
                return a.quantity - b.quantity;
            });

            setInventories(sortedInventories);
        } catch (err) {
            setAlert({ type: "error", message: err.message });
        }
    };

    useEffect(() => {
        getInventoriesData();
    }, [currUser.templeId]);

    useEffect(()=> {
        if(isInvetoryUpdated) {
            getInventoriesData();
            setIsInventoryUpdated(false);
        }
    }, [isInvetoryUpdated]);

    const hasPermission = (action) => {
        return (
            currUser && currUser.isAdmin ||
            (currUser.roles && currUser.roles.some(role =>
                role.permissions.some(p => p.actions.includes(action))
            ))
        );
    };

    const getStatusIcon = (quantity) => {
        if (quantity === 0) return <AiOutlineCloseCircle className="text-red-500 ml-2" />;
        if (quantity < 10 && quantity > 0) return <AiOutlineWarning className="text-yellow-500 ml-2" />;
        return <AiOutlineCheckCircle className="text-green-500 ml-2" />;
    };

    //edit inventory function
    const handleEditInventory = (inventory)=> {
        setInventory(inventory);
        setEditModal(true);
    }
    return (
        <>
            <section className="min-h-screen">
                {alert.message && (
                    <Alert color={alert.type === 'success' ? 'success' : 'failure'} icon={alert.type === 'success' ? AiOutlineCheckCircle : AiOutlineCloseCircle} className="my-4" onDismiss={()=> setAlert({ type : "", message : ""})}>
                        <span className="font-medium">
                            {alert.type === 'success' ? 'Success!' : 'Error!'}
                        </span> {alert.message}
                    </Alert>
                )}
                {
                    inventories.length > 0 && hasPermission("read") ? (
                        <div className="overflow-x-auto scrollbar-hidden">
                            <Table striped>
                                <Table.Head>
                                    <Table.HeadCell>Inventory Name</Table.HeadCell>
                                    <Table.HeadCell>Description</Table.HeadCell>
                                    <Table.HeadCell>Category</Table.HeadCell>
                                    <Table.HeadCell>Quantity</Table.HeadCell>
                                    <Table.HeadCell>Unit</Table.HeadCell>
                                    <Table.HeadCell>Unit Price</Table.HeadCell>
                                    <Table.HeadCell>Total Price</Table.HeadCell>
                                    <Table.HeadCell>Actions</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {inventories.map((inventory, index) => (
                                        <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {inventory.name}
                                            </Table.Cell>
                                            <Table.Cell>{inventory.description}</Table.Cell>
                                            <Table.Cell>{inventory.category}</Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center justify-center" >
                                                    {inventory.quantity} {getStatusIcon(inventory.quantity)}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>{inventory.unit}</Table.Cell>
                                            <Table.Cell>{`${inventory.unitPrice}/${inventory.unit}`}</Table.Cell>
                                            <Table.Cell>{inventory.totalPrice}</Table.Cell>
                                            {
                                                hasPermission("update") && hasPermission("delete") && (
                                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                        <div className="flex justify-between items-center gap-4">
                                                            {hasPermission("update") && (
                                                                <span className="cursor-pointer">
                                                                    <FaPencil size={16} color="teal" onClick={()=> handleEditInventory(inventory)} />
                                                                </span>
                                                            )}
                                                            {hasPermission("delete") && (
                                                                <span className="cursor-pointer">
                                                                    <MdDelete size={20} color="red" onClick={()=> handleDeleteInventory(inventory)} />
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Table.Cell>
                                                )
                                            }
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    )
                        : (
                            <div className="flex justify-center items-center h-screen">
                                <div className="text-center flex flex-col items-center justify-center">
                                    <TbFaceIdError size={50} className="animate-bounce" />
                                    <p>No Inventories Added Yet!</p>
                                </div>
                            </div>
                        )
                }
            </section>
            {/* edit inventory component */}
            { editModal && (
                <EditInventoryItem
                    editModal={editModal} 
                    setEditModal={setEditModal}
                    inventory={inventory}
                    setIsInventoryUpdated={setIsInventoryUpdated}
                />
            ) }
        </>
    );
}
