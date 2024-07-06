import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TbFaceIdError } from "react-icons/tb";
import { AiOutlineWarning, AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { Alert, Button, Pagination, Table, Tooltip } from "flowbite-react";
import { FaPencil } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { IoFilterCircleOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { debounce } from "lodash";

const EditInventoryItem = React.lazy(() => import("../edit/EditInventoryItem"));
const DeleteInventory = React.lazy(() => import("../delete/DeleteInventory"));
const InventoryFilter = React.lazy(() => import("../InventoryFilter"));

export default function DashInventories() {
    const { currUser } = useSelector(state => state.user);
    const { searchTerm } = useSelector(state => state.searchTerm);
    const location = useLocation();
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [inventories, setInventories] = useState([]);
    const [totalInventories, setTotalInventories] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [inventory, setInventory] = useState({});
    const [isDeleted, setIsDeleted] = useState(false);
    const [isInvetoryUpdated, setIsInventoryUpdated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [filterCount, setFilterCount] = useState(0);

    const onPageChange = (page) => setCurrentPage(page);
    const queryParams = new URLSearchParams(location.search);

    const getInventoriesData = async () => {
        const tab = queryParams.get("tab");

        // Conditionally include searchTerm only when tab is 'daans'
        const searchParam = tab === 'inventories' ? `&searchTerm=${searchTerm}` : '';
        const apiUrl = `/api/inventory/get/${currUser.templeId}${queryParams ? '?' + queryParams.toString() : ''}${searchParam}`;

        setAlert({ type: "", message: "" });
        try {
            const response = await fetch(apiUrl);
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
            setTotalInventories(data.totalInventories);
        } catch (err) {
            setAlert({ type: "error", message: err.message });
        }
    };

    // Debounce getAllDonations function
    const debouncedFetchInventories = useCallback(debounce(getInventoriesData, 800), [searchTerm, currUser, location.search]);

    useEffect(() => {
        debouncedFetchInventories();
    }, [searchTerm, currUser.templeId, location.search]);

    useEffect(() => {
        if (isInvetoryUpdated) {
            getInventoriesData();
            setIsInventoryUpdated(false);
        }
    }, [isInvetoryUpdated]);

    useEffect(() => {
        if (isDeleted) {
            getInventoriesData();
            setIsDeleted(false);
        }
    }, [isDeleted]);

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

    // Edit inventory function
    const handleEditInventory = (inventory) => {
        setInventory(inventory);
        setEditModal(true);
    };

    // Delete inventory function
    const handleDeleteInventory = (inventory) => {
        setInventory(inventory);
        setDeleteModal(true);
    };

    return (
        <>
            <section className="min-h-screen">
                {/* Filter button */}
                {
                    hasPermission("read") && (
                        <div className="mb-3 flex flex-row-reverse sticky left-0">
                            <Tooltip content={`${filterCount} filters applied`} placement="left">
                                <Button color={"red"} onClick={() => setIsDrawerOpen(true)} >
                                    <IoFilterCircleOutline className="mr-2 h-5 w-5" />
                                    Filters
                                </Button>
                            </Tooltip>
                        </div>
                    )
                }
                {/* Filter modal */}
                {
                    isDrawerOpen && hasPermission("read") && (
                        <InventoryFilter
                            isDrawerOpen={isDrawerOpen}
                            setIsDrawerOpen={setIsDrawerOpen}
                            filterCount={filterCount}
                            setFilterCount={setFilterCount}
                        />
                    )
                }
                {/* Pagination */}
                {
                    totalInventories && totalInventories > 20 && hasPermission("read") && (
                        <div className="flex overflow-x-auto sm:justify-center mb-5 sticky left-0">
                            <Pagination currentPage={currentPage} totalPages={Math.ceil(totalInventories / 20)} onPageChange={onPageChange} showIcons />
                        </div>
                    )
                }
                {alert.message && (
                    <Alert color={alert.type === 'success' ? 'success' : 'failure'} icon={alert.type === 'success' ? AiOutlineCheckCircle : AiOutlineCloseCircle} className="my-4" onDismiss={() => setAlert({ type: "", message: "" })}>
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
                                    {inventories.length > 0 && inventories.slice((currentPage - 1) * 20, currentPage * 20).map((inventory, index) => (
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
                                                                    <FaPencil size={16} color="teal" onClick={() => handleEditInventory(inventory)} />
                                                                </span>
                                                            )}
                                                            {hasPermission("delete") && (
                                                                <span className="cursor-pointer">
                                                                    <MdDelete size={20} color="red" onClick={() => handleDeleteInventory(inventory)} />
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
                {/* Pagination */}
                {
                    totalInventories && totalInventories > 20 && hasPermission("read") && (
                        <div className="flex overflow-x-auto sm:justify-center mb-5 sticky left-0">
                            <Pagination currentPage={currentPage} totalPages={Math.ceil(totalInventories / 20)} onPageChange={onPageChange} showIcons />
                        </div>
                    )
                }
            </section>
            {/* Edit inventory component */}
            {editModal && (
                <EditInventoryItem
                    editModal={editModal}
                    setEditModal={setEditModal}
                    inventory={inventory}
                    setIsInventoryUpdated={setIsInventoryUpdated}
                />
            )}
            {/* Delete inventory component */}
            {deleteModal && (
                <DeleteInventory
                    deleteModal={deleteModal}
                    setDeleteModal={setDeleteModal}
                    inventoryId={inventory._id}
                    setIsDeleted={setIsDeleted}
                />
            )}
        </>
    );
}
