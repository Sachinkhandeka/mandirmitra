import { Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { SiEventbrite } from 'react-icons/si';
import { useSelector } from 'react-redux';
import AttendanceStats from './AttendenceStats';
import { Helmet } from 'react-helmet-async';

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
        <>
        <Helmet>
            <title>{name} - Event Details</title>
            <meta name="description" content={`Event details for ${name}, happening on ${new Date(date).toLocaleDateString()} at ${location}.`} />
        </Helmet>
        <article
            className={`min-w-[18rem] lg:max-w-md xl:max-w-lg 2xl:max-w-xl 
            rounded-3xl overflow-hidden shadow-lg border border-slate-300 
            dark:border-slate-700 bg-gradient-to-br ${getRandomGradient()} 
            text-white dark:bg-slate-800 m-4 cursor-pointer flex flex-col justify-between 
            transform transition-transform duration-300 hover:scale-105
            ${isSelected ? 'ring-4 ring-blue-600' : ''}
            `}
            key={id}
            onClick={onClick}
        >
            <div className='p-6'>
                <div className="font-extrabold text-xl md:text-2xl mb-4 flex items-center gap-3">
                    <SiEventbrite className="text-blue-200" />
                    {name}
                </div>
                <div className='pl-4 text-sm flex flex-col gap-4'>
                    <p className="flex items-center gap-2">
                        <FaCalendarAlt className="text-green-300" />
                        {new Date(date).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-300" />
                        {location}
                    </p>
                    <span className={`mt-4 inline-block text-xs font-semibold px-4 py-2 rounded-full ${status === 'completed' ? 'bg-green-200 text-green-900' : 'bg-blue-200 text-blue-900'}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
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
                            `flex justify-center items-center gap-4 w-full h-16 px-4 
                            bg-gradient-to-r ${getRandomGradient()} 
                            transition-opacity duration-300 ease-in-out hover:opacity-90`
                        }
                    >
                        {
                            (currUser && currUser.isAdmin ||
                                (currUser.roles && currUser.roles.some(role => role.permissions.some(p => p.actions.includes("update"))))) && (
                                <>
                                    <span className="cursor-pointer px-2 py-1 text-sm bg-white text-blue-600 rounded-lg font-semibold hover:text-blue-800 hover:bg-blue-100" onClick={() => setEditModal(true)}>
                                        Edit
                                    </span>
                                    {status === "pending" && (
                                        <span className="cursor-pointer px-2 py-1 text-sm bg-white text-yellow-600 rounded-lg font-semibold hover:text-yellow-800 hover:bg-yellow-100" onClick={() => setInviteModal(true)}>
                                            Invite
                                        </span>
                                    )}
                                </>
                            )
                        }
                        {
                            (currUser && currUser.isAdmin ||
                                (currUser.roles && currUser.roles.some(role => role.permissions.some(p => p.actions.includes("delete"))))) && (
                                <span className="cursor-pointer text-sm px-2 py-1 bg-white text-red-600 rounded-lg font-semibold hover:text-red-800 hover:bg-red-100" onClick={handleDelete} >
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
        </article>
        </>
    );
}
