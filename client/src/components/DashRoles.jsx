import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";

const EditRoleModal = React.lazy(()=> import("./EditRoleModal"));
const DeleteRoleModal = React.lazy(()=> import("./DeleteRoleModal"));

export default function DashRoles() {
    const { currUser } = useSelector(state => state.user);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [roles, setRoles] = useState([]);
    const [ showModal , setShowModal ] = useState(false);
    const [ deleteModal , setDeleteModal ] = useState(false);
    const [ roleData , setRoleData ] = useState({});
    const [ roleUpdated , setRoleUpdated ] = useState(false);

    
    useEffect(() => {
        if (roleUpdated) {
            getRolesData(); // Re-fetch user data
            setRoleUpdated(false); // Reset userDataUpdated state
        }
    }, [roleUpdated]);

    // Function to fetch roles data
    const getRolesData = async () => {
        try {
            setError(null);
            setSuccess(null);

            const response = await fetch(`/api/role/get/${currUser.templeId}`);
            const data = await response.json();

            if (!response.ok) {
                return setError(data.message);
            }
            setRoles(data.roles);
        } catch (err) {
            setError(err.message);
        }
    };
    // Fetch roles data on component mount or when currUser changes
    useEffect(() => {
        getRolesData();
    }, [currUser]);

    //function to edit roles
    const handleEdit = (role)=> {
        setShowModal(true);
        setRoleData(role);
    }

    //function to delete roles
    const handleDelete = async(role)=> {
        setDeleteModal(true);
        setRoleData(role);
    }

    return (
        <>
            {/* Success toast */}
            {success && (
                <Toast className="mb-3">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                        <HiCheck className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{success}</div>
                    <Toast.Toggle onDismiss={() => setSuccess(null)} />
                </Toast>
            )}
            {/* Error toast */}
            {error && (
                <Toast className="mb-3">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                        <HiX className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{error}</div>
                    <Toast.Toggle onDismiss={() => setError(null)} />
                </Toast>
            )}
            {/* Displaying roles table if isAdmin and roles array has length > 0 */}
            {currUser.isAdmin && roles.length > 0 ? (
                <Table striped>
                    <Table.Head>
                        <Table.HeadCell>Role Name</Table.HeadCell>
                        <Table.HeadCell>Permission Name</Table.HeadCell>
                        <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    {roles.map((role) => (
                        <Table.Body className="divide-y" key={role._id}>
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>{role.name}</Table.Cell>
                                <Table.Cell>
                                    {role.permissions.map((permission, index) => (
                                        <div  key={index} >
                                            <p>{ permission.permissionName }</p>
                                            <span className="block text-xs">
                                                [{permission.actions.join(', ')}]
                                            </span>
                                        </div>
                                    ))}
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex items-center gap-4" >
                                        <span onClick={()=> handleEdit(role)} className="cursor-pointer" >
                                            <MdOutlineEdit size={20} color="teal"/>
                                        </span>
                                        <span onClick={()=> handleDelete(role)} className="cursor-pointer" >
                                            <MdDeleteOutline size={20} color="red"/>
                                        </span>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ))}
                </Table>
            ) : (
                // Displaying message if there are no roles
                <p>No Roles Created Yet!</p>
            )}
            {/* edit role component */}
            <EditRoleModal 
                roleData={roleData}
                setRoleData={setRoleData}
                showModal={showModal}
                setShowModal={setShowModal}
                setRoleUpdated={setRoleUpdated}
            />
            {/* delete role component */}
            <DeleteRoleModal 
                deleteModal={deleteModal}
                setDeleteModal={setDeleteModal}
                setError={setError}
                setRoleUpdated={setRoleUpdated}
                userId={ roleData && roleData._id }
            />
        </>
    );
}
