import { Alert , Table ,  } from "flowbite-react";
import React, { useState , useEffect } from "react";
import { useSelector } from "react-redux";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { TbFaceIdError } from "react-icons/tb";
import { Helmet } from 'react-helmet-async';

const EditPermissionsModal = React.lazy(()=> import("../edit/EditPermissionsModal"));
const DeletePermissionModal = React.lazy(()=> import("../delete/DeletePermissionModal"));

export default function DashPermissions() {
    const { currUser } = useSelector(state => state.user);
    const [ error , setError ] = useState(null);
    const [ success , setSuccess ] = useState(null);
    const [ permissions, setPermissions ] = useState({});
    const [ showModal , setShowModal ] = useState(false);
    const [ deleteModal , setDeleteModal ] = useState(false);
    const [ permissionData , setPermissionData ] = useState({});
    const [ permissionUpdated , setPermissionUpdated ] = useState(false);

    const getPermissionsData = async()=> {
        try {
            setError(null);
            setSuccess(null);

            if (!currUser || !currUser.templeId) {
                setError("Invalid user or templeId");
                return;
            }
            const response = await fetch(`/api/permission/get/${currUser.templeId.toString()}`);
            const data = await response.json();
            
            if(!response.ok) {
                return setError(data.message);
            }
            setPermissions( data.permissions );
        }catch(err) {
            setError(err.message);
        }
    }

    useEffect(()=> {
        getPermissionsData();
        setPermissionUpdated(false);
    },[ currUser , permissionUpdated ]);

    //function to edit permission
    const handleEdit = (permission)=> {
        setShowModal(true);
        setPermissionData(permission);
    }

    //function to delete permission
    const handleDelete = async(permission)=> {
        setDeleteModal(true);
        setPermissionData(permission);
    }

    return (
        <>
            <Helmet>
                <title>Manage Permissions - Dashboard</title>
                <meta name="description" content="View, edit, and delete permissions for your temple. Manage user access rights efficiently." />
            </Helmet>
            { error && ( <Alert color={"failure"} onDismiss={()=> setError(null) } className="mb-3" >{ error }</Alert> ) }
            { success && ( <Alert color={"success"} onDismiss={()=> setSuccess(null)} className="mb-3" >{ success }</Alert> ) }
            {/* Displaying permissions table if isAdmin and permissions array has length > 0 */}
            {currUser.isAdmin && permissions.length > 0 ? (
                <Table striped>
                    <Table.Head>
                        <Table.HeadCell>Permission Name</Table.HeadCell>
                        <Table.HeadCell>Operations</Table.HeadCell>
                        <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    {permissions.map((permission) => (
                        <Table.Body className="divide-y" key={permission._id}>
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>{permission.permissionName}</Table.Cell>
                                <Table.Cell>
                                    {permission.actions.map((action , index) => (
                                        <div  key={index} >
                                            <span className="flex text-xs">
                                                [ {action} ],
                                            </span>
                                        </div>
                                    ))}
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex items-center gap-6" >
                                        <span  className="cursor-pointer" >
                                            <MdOutlineEdit onClick={()=> handleEdit(permission)}  size={20} color="teal"/>
                                        </span>
                                        <span  className="cursor-pointer" >
                                            <MdDeleteOutline onClick={()=> handleDelete(permission)} size={20} color="red"/>
                                        </span>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    ))}
                </Table>
            ) : (
                // Displaying message if there are no permissions
                <div className="flex justify-center items-center h-screen">
                    <div className="text-center flex flex-col items-center justify-center">
                        <TbFaceIdError size={50} className="animate-bounce" />
                        <p>No Permissions Created Yet!</p>
                    </div>
                </div>
            )}
            {/* Edit permission modal */}
            <EditPermissionsModal 
                showModal={showModal}
                setShowModal={setShowModal}
                setSuccess={setSuccess}
                permissionData={permissionData}
                setPermissionUpdated={setPermissionUpdated}
            />
            {/* Delete permission modal */}
            <DeletePermissionModal 
                deleteModal={deleteModal}
                setDeleteModal={setDeleteModal}
                permissionId={ permissionData && permissionData._id }
                setPermissionUpdated={setPermissionUpdated}
            />

        </>
    );
}