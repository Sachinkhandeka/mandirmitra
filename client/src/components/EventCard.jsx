import { Spinner } from 'flowbite-react';
import React, { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { SiEventbrite } from "react-icons/si";
import { useSelector } from 'react-redux';

const EditEvent = React.lazy(()=> import("../components/edit/EditEvent"));
const Invite = React.lazy(()=> import("./Invite"));

export default function EventCard({ name, date, location, status, id, setIsEventUpdated, isSelected, onClick }) {
    const { currUser } = useSelector(state=> state.user);
    const [ editModal, setEditModal ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ inviteModal, setInviteModal ] = useState(false);
    
    const handleDelete = async()=> {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/event/delete/${id}/${currUser.templeId}`,
                {
                    method : "DELETE",
                }
            );
            const data = await response.json();

            if(!response.ok) {
                setLoading(false);
                return console.log(data.message);   
            }
            setLoading(false);
            setIsEventUpdated(true);
        } catch(err) {
            setLoading(false);
            console.log(err.message);
        }
    }

    return (
        <div 
            className={`max-w-72 rounded-xl overflow-hidden hover:shadow-lg border 
            border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 
            p-6 m-4 min-w-72 cursor-pointer
            ${isSelected ? 
                `border-2 border-t-blue-600 border-r-red-600 border-b-yellow-400 border-l-green-500 shadow
                dark:border-2 dark:border-r-2 dark:border-t-blue-600 dark:border-b-yellow-400 dark:border-r-red-600 
                dark:border-l-green-600 dark:shadow` : ''
            }`}
            key={id}
            onClick={onClick}
        >
            <div className="font-bold text-xl mb-4 flex items-center gap-3">
                <SiEventbrite className="text-blue-500 mr-2" />
                {name}
            </div>
            <div className='pl-4 text-xs flex items-start flex-col gap-4' >
                <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-green-500 mr-2" />
                    {new Date(date).toLocaleDateString()}
                </p>
                <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-500 mr-2" />
                    {location}
                </p>
                <span className={`mt-2 px-2 py-1 rounded ${status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {status}
                </span>
            </div>
            <hr className='my-6' />
            {/* Render edit and delete icons if user is an admin or has permission to edit or delete event */}
            {
                ( currUser && currUser.isAdmin ||
                ( currUser.roles && currUser.roles.some(role => role.permissions.some(p => p.actions.includes("update") || p.actions.includes("delete") )) ) ) && (
                    <div className="flex mt-4 items-center gap-4" >
                        { 
                            // Render edit icon if user is admin or has permission to edit event
                            ( currUser && currUser.isAdmin ||
                            ( currUser.roles && currUser.roles.some(role=> role.permissions.some(p=> p.actions.includes("update"))))) && (
                                <>
                                    <span className="cursor-pointer px-2 py-1 text-sm hover:text-blue-800 hover:bg-blue-100 hover:rounded-lg" onClick={()=> setEditModal(true)}>
                                        Edit
                                    </span>
                                    { status === "pending" && (
                                        <span className="cursor-pointer px-2 py-1 text-sm hover:text-yellow-800 hover:bg-yellow-100 hover:rounded-lg" onClick={()=> setInviteModal(true)}>
                                            Invite
                                        </span>
                                    ) }
                                </>
                            )
                        }
                        { 
                            // Render delete icon if user is admin or has permission to delete events
                            ( currUser && currUser.isAdmin ||
                            ( currUser.roles && currUser.roles.some(role=> role.permissions.some(p=> p.actions.includes("delete"))))) && (
                                <span className="cursor-pointer text-sm px-2 py-1 hover:text-red-800 hover:bg-red-100 hover:rounded-lg"  onClick={handleDelete} >
                                    { loading ? <Spinner color={"failure"} /> : "Delete" }
                                </span>
                            )
                        }
                    </div>
                )
            }
            { editModal && (
                <EditEvent
                    editModal={editModal}
                    setEditModal={setEditModal} 
                    setIsEventUpdated={setIsEventUpdated}
                    name={name}
                    date={date}
                    location={location}
                    status={status}
                    id={id}
                />
            ) }
            { inviteModal && (
                <Invite 
                    inviteModal={inviteModal}
                    setInviteModal={setInviteModal}
                    name={name}
                    location={location}
                    date={date}
                    id={id}
                />
            ) }
        </div>
    );
}
