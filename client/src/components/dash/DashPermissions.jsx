import { Table } from "flowbite-react";
import React, { useState , useEffect } from "react";
import { useSelector } from "react-redux";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { TbFaceIdError } from "react-icons/tb";
import { Helmet } from 'react-helmet-async';
import Alert from "../Alert";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshSuperAdminOrUserAccessToken } from "../../utilityFunx";

const EditPermissionsModal = React.lazy(()=> import("../edit/EditPermissionsModal"));
const DeletePermissionModal = React.lazy(()=> import("../delete/DeletePermissionModal"));

export default function DashPermissions() {
    const navigate = useNavigate();
    const { currUser } = useSelector(state => state.user);
    const [ alert, setAlert ] = useState({ type : "", message : "" });
    const [ loading, setLoading ] = useState(false);
    const [ permissions, setPermissions ] = useState({});
    const [ showModal , setShowModal ] = useState(false);
    const [ deleteModal , setDeleteModal ] = useState(false);
    const [ permissionData , setPermissionData ] = useState({});
    const [ permissionUpdated , setPermissionUpdated ] = useState(false);

    const getPermissionsData = async()=> {
        try {
            setLoading(true);
            setAlert({ type : "", message : "" });

            if (!currUser || !currUser.templeId) {
                setAlert({ type : "error", message : "Invalid user or templeId" });
                return setLoading(false);;
            }

            const data = await fetchWithAuth(
                `/api/permission/get/${currUser.templeId.toString()}`,
                {},
                refreshSuperAdminOrUserAccessToken,
                "User",
                setLoading,
                setAlert,
                navigate
            );
            if(data) {
                setPermissions( data.permissions );
                setAlert({ type : "success", message: "Permissions data fetched successfully." });
                setLoading(false);
            }
        }catch(err) {
            setLoading(false);
            setAlert({ type : "error", message: err.message });
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
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm" >
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                )}
            </div>
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
                setAlert={setAlert}
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