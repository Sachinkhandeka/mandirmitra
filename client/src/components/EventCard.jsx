import { Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { SiEventbrite } from 'react-icons/si';
import { useSelector } from 'react-redux';
import AttendanceStats from './AttendenceStats';

// Function to get a random gradient color
function getRandomGradient() {
    const gradients = [
        "from-blue-300 to-indigo-500",
        "from-purple-400 to-pink-500",
        "from-yellow-400 to-orange-500",
        "from-green-400 to-teal-500",
        "from-red-400 to-pink-500",
        "from-indigo-400 to-purple-500",
        "from-pink-400 to-rose-500",
        "from-orange-400 to-yellow-500",
        "from-teal-400 to-cyan-500",
        "from-rose-400 to-red-500"
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
}

const EditEvent = React.lazy(() => import("../components/edit/EditEvent"));
const Invite = React.lazy(() => import("./Invite"));

export default function EventCard({ name, date, location, status, id, setIsEventUpdated, isSelected, onClick }) {
    const { currUser } = useSelector(state => state.user);
    const [editModal, setEditModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inviteModal, setInviteModal] = useState(false);
    const [guestCount, setGuestCount] = useState(0);
    const [attended, setAttended] = useState(0);
    const [notAttended, setNotAttended] = useState(0);

    const getGuestCount = async () => {
        try {
            const response = await fetch(
                `/api/invitation/get/${currUser.templeId}/${id}`
            );
            const data = await response.json();

            if (!response.ok) {
                return console.error("Error while fetching guests data.");
            }

            setGuestCount(data.guestCount);
            setAttended(data.attendedCount);
            setNotAttended(data.notAttendedCount);
        } catch (err) {
            console.error("Error while fetching guests data.", err);
        }
    };

    useEffect(() => {
        getGuestCount();
    }, [id]);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/event/delete/${id}/${currUser.templeId}`,
                {
                    method: "DELETE",
                }
            );
            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                return console.log(data.message);
            }
            setLoading(false);
            setIsEventUpdated(true);
        } catch (err) {
            setLoading(false);
            console.log(err.message);
        }
    }

    return (
        <div
            className={`max-w-72 rounded-xl overflow-hidden hover:shadow-lg border 
            border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 
            m-4 min-w-72 cursor-pointer flex flex-col justify-between
            ${isSelected ?
                `border-2 border-t-blue-600 border-r-red-600 border-b-yellow-400 border-l-green-500 shadow
                dark:border-2 dark:border-r-2 dark:border-t-blue-600 dark:border-b-yellow-400 dark:border-r-red-600 
                dark:border-l-green-600 dark:shadow` : ''
                }`}
            key={id}
            onClick={onClick}
        >
            <div className='p-6' >
                <div className="font-bold text-xl mb-4 flex items-center gap-3">
                    <SiEventbrite className="text-blue-500 mr-2" />
                    {name}
                </div>
                <div className='pl-4 text-xs flex items-start flex-col gap-4'>
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
                    <AttendanceStats
                        guestCount={guestCount}
                        attended={attended}
                        notAttended={notAttended}
                    />
                </div>
            </div>
            {
                (currUser && currUser.isAdmin ||
                    (currUser.roles && currUser.roles.some(role => role.permissions.some(p => p.actions.includes("update") || p.actions.includes("delete"))))) && (
                    <div 
                        className={
                            `flex justify-center items-center gap-4 w-full 
                            h-16 px-4 mt-2 bg-gradient-to-r ${getRandomGradient()} 
                            opacity-100 md:opacity-0 md:transition-opacity md:duration-300 md:ease-in-out 
                            md:hover:opacity-100`
                        }
                    >
                        {
                            (currUser && currUser.isAdmin ||
                                (currUser.roles && currUser.roles.some(role => role.permissions.some(p => p.actions.includes("update"))))) && (
                                <>
                                    <span className="cursor-pointer px-2 py-1 text-sm hover:text-blue-800 hover:bg-blue-100 hover:rounded-lg" onClick={() => setEditModal(true)}>
                                        Edit
                                    </span>
                                    {status === "pending" && (
                                        <span className="cursor-pointer px-2 py-1 text-sm hover:text-yellow-800 hover:bg-yellow-100 hover:rounded-lg" onClick={() => setInviteModal(true)}>
                                            Invite
                                        </span>
                                    )}
                                </>
                            )
                        }
                        {
                            (currUser && currUser.isAdmin ||
                                (currUser.roles && currUser.roles.some(role => role.permissions.some(p => p.actions.includes("delete"))))) && (
                                <span className="cursor-pointer text-sm px-2 py-1 hover:text-red-800 hover:bg-red-100 hover:rounded-lg" onClick={handleDelete} >
                                    {loading ? <Spinner color={"failure"} /> : "Delete"}
                                </span>
                            )
                        }
                    </div>
                )
            }
            {editModal && (
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
            )}
            {inviteModal && (
                <Invite
                    inviteModal={inviteModal}
                    setInviteModal={setInviteModal}
                    name={name}
                    location={location}
                    date={date}
                    id={id}
                />
            )}
        </div>
    );
}
