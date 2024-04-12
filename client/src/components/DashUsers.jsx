import { Table, Toast } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";
import { useSelector } from "react-redux";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";

export  default  function DashUsers() {
    const { currUser } = useSelector(state => state.user);
    const [ users, setUsers ] = useState([]);
    const [ error , setError ] = useState(null);
    const [ success , setSuccess ] = useState(null);

    //get-fetch all users data
    const getUsers = async()=> {
        try {
            setError(null);
            setSuccess(null);

            const response  =  await fetch(`/api/user/get/${currUser.templeId}`);
            const  data = await response.json();

            if(!response.ok) {
                return setError(data.message);
            }
            setUsers(data.allUser);
            setSuccess(`Welcome ${currUser.username} we have fatched users data for you🤗🫡.`);
        }catch(err) {
            setError(err.message);
        }
    }
    useEffect(()=> {
        getUsers();
    },[currUser])
    return (
        <>
            { success && (
                <Toast className="mb-3" >
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                        <HiCheck className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">{ success }</div>
                    <Toast.Toggle onDismiss={()=> setSuccess(null)} />
                </Toast>
            ) }
            { error && (
                <Toast className="mb-3" >
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200" >
                        <HiX className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal" >{ error }</div>
                    <Toast.Toggle onDismiss={()=> setError(null)} />
                </Toast>
            ) }
            { currUser.isAdmin && ( 
                <Table striped >
                    <Table.Head>
                        <Table.HeadCell>Profile</Table.HeadCell>
                        <Table.HeadCell>Username</Table.HeadCell>
                        <Table.HeadCell>Email</Table.HeadCell>
                        <Table.HeadCell>Roles</Table.HeadCell>
                        <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    {
                        users && Array.isArray(users) && users.length > 0 && (
                            users.map((user, indx)=> {
                                return (
                                    <Table.Body className="divide-y" key={user._id} >
                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" >
                                            <Table.Cell>
                                                <img src={user.profilePicture} alt={user.username} className="h-10 w-10 rounded-full" />
                                            </Table.Cell>
                                            <Table.Cell>{ user.username }</Table.Cell>
                                            <Table.Cell>{ user.email }</Table.Cell>
                                            <Table.Cell>
                                                { user.roles[indx].name }
                                                <span className="block text-xs" >[{ user.roles[indx].permissions.map(permission => permission.actions.join(", ")) }]</span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-4" >
                                                    <Link to={"#"} > <MdOutlineEdit size={20} />  </Link>
                                                    <Link to={"#"} > <MdDeleteOutline size={20}/> </Link>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                );
                            })
                        )
                    }
                </Table>
            )}
        </>
    )
}