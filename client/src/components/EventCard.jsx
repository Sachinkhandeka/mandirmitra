import React from 'react';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { SiEventbrite } from "react-icons/si";
import { useSelector } from 'react-redux';

export default function EventCard({ name, date, location, status, id }) {
    const { currUser } = useSelector(state=> state.user);
  return (
    <div className={`max-w-sm rounded overflow-hidden hover:shadow-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 m-4 min-w-72`} key={id}>
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
        {/* Render edit and delete icons if user is an admin or has permission to edit or delete donations */}
        {
            ( currUser && currUser.isAdmin ||
            ( currUser.roles && currUser.roles.some(role => role.permissions.some(p => p.actions.includes("update") || p.actions.includes("delete") )) ) ) && (
                <div className="flex mt-4 items-center gap-4" >
                    { 
                        // Render edit icon if user is admin or has permission to edit donations
                        ( currUser && currUser.isAdmin ||
                        ( currUser.roles && currUser.roles.some(role=> role.permissions.some(p=> p.actions.includes("update"))))) && (
                            <span className="cursor-pointer px-2 py-1 text-sm hover:text-blue-800 hover:bg-blue-100 hover:rounded-lg">
                                Edit
                            </span>
                        )
                    }
                    { 
                        // Render delete icon if user is admin or has permission to delete donations
                        ( currUser && currUser.isAdmin ||
                        ( currUser.roles && currUser.roles.some(role=> role.permissions.some(p=> p.actions.includes("delete"))))) && (
                            <span className="cursor-pointer text-sm px-2 py-1 hover:text-red-800 hover:bg-red-100 hover:rounded-lg"  >
                                Delete
                            </span>
                        )
                    }
                </div>
            )
        }
    </div>
  );
}