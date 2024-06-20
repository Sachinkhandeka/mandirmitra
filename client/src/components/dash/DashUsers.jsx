import { Table, Toast } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiCheck, HiX } from "react-icons/hi";
import { useSelector } from "react-redux";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { TbFaceIdError } from "react-icons/tb";
import { Helmet } from "react-helmet-async";

const EditUserModal = React.lazy(() => import("../edit/EditUserModal"));
const DeleteUserModal = React.lazy(() => import("../delete/DeleteUserModal"));

export default function DashUsers() {
    const { currUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [userData, setUserData] = useState({});
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [userDataUpdated, setUserDataUpdated] = useState(false);

    useEffect(() => {
        if (userDataUpdated) {
            getUsers(); // Re-fetch user data
            setUserDataUpdated(false); // Reset userDataUpdated state
        }
    }, [userDataUpdated]);

    // Get-fetch all users data
    const getUsers = async () => {
        try {
            setError(null);
            setSuccess(null);

            const response = await fetch(`/api/user/get/${currUser.templeId}`);
            const data = await response.json();

            if (!response.ok) {
                return setError(data.message);
            }
            setUsers(data.allUser);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        getUsers();
    }, [currUser]);

    // Handle Edit user function
    const handleEdit = (user) => {
        setShowModalEdit(true);
        setUserData(user);
    };

    // Handle Delete user function
    const handleDelete = (user) => {
        setShowModalDelete(true);
        setUserData(user);
    };

    return (
        <>
            <Helmet>
                <title>Users Management - Dashboard</title>
                <meta name="description" content="Manage users efficiently. View, edit, and delete user at your temple." />
            </Helmet>
            {success && (
                <Toast className="mb-3 min-w-36">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                        <HiCheck className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{success}</div>
                    <Toast.Toggle onDismiss={() => setSuccess(null)} />
                </Toast>
            )}
            {error && (
                <Toast className="mb-3">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                        <HiX className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{error}</div>
                    <Toast.Toggle onDismiss={() => setError(null)} />
                </Toast>
            )}
            {currUser.isAdmin && users.length > 0 ? (
                <Table striped>
                    <Table.Head>
                        <Table.HeadCell>Profile Picture</Table.HeadCell>
                        <Table.HeadCell>Username</Table.HeadCell>
                        <Table.HeadCell>Email Address</Table.HeadCell>
                        <Table.HeadCell>phoneNumber</Table.HeadCell>
                        <Table.HeadCell>Roles</Table.HeadCell>
                        <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    {users &&
                        Array.isArray(users) &&
                        users.length > 0 &&
                        users.map((user) => (
                            <Table.Body className="divide-y" key={user._id}>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        <img
                                            src={user.profilePicture}
                                            alt={`${user.username}'s profile`}
                                            className="h-10 w-10 rounded-full"
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{user.username}</Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>{user.phoneNumber}</Table.Cell>
                                    <Table.Cell>
                                        {user.roles && user.roles.length > 0
                                            ? user.roles.map((role) => (
                                                  <div key={role._id}>
                                                      <p>{role.name}</p>
                                                      <span className="block text-xs">
                                                          [
                                                          {role.permissions
                                                              .map((permission) =>
                                                                  permission.actions.join(", ")
                                                              )
                                                              .join(", ")}
                                                          ]
                                                      </span>
                                                  </div>
                                              ))
                                            : "-"}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                aria-label={`Edit user ${user.username}`}
                                                className="cursor-pointer"
                                            >
                                                <MdOutlineEdit size={20} color="teal" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                aria-label={`Delete user ${user.username}`}
                                                className="cursor-pointer"
                                            >
                                                <MdDeleteOutline size={20} color="red" />
                                            </button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                </Table>
            ) : (
                // Displaying message if there are no users
                <div className="flex justify-center items-center h-screen">
                    <div className="text-center flex flex-col items-center justify-center">
                        <TbFaceIdError size={50} className="animate-bounce" />
                        <p>No Users Created Yet!</p>
                    </div>
                </div>
            )}
            {/* EditUserModal */}
            <EditUserModal
                showModalEdit={showModalEdit}
                setShowModalEdit={setShowModalEdit}
                userData={userData}
                setUserData={setUserData}
                setUserDataUpdated={setUserDataUpdated}
            />
            {/* DeleteUserModal */}
            <DeleteUserModal
                showModalDelete={showModalDelete}
                setShowModalDelete={setShowModalDelete}
                userId={userData && userData._id}
                setError={setError}
                setSuccess={setSuccess}
                setUserDataUpdated={setUserDataUpdated}
            />
        </>
    );
}
