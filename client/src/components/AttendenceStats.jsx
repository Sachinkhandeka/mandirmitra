import { FaUserCheck, FaUserTimes, FaUsers } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

export default function AttendanceStats({ guestCount, attended, notAttended }) {
    return (
        <section className="attendance-stats">
            <Helmet>
                <title>Event Attendance Statistics</title>
                <meta name="description" content="View attendance statistics for event guests, including total guests, attendees, and non-attendees." />
            </Helmet>
            <div className="mt-1 w-full py-4 px-6 bg-white dark:bg-slate-700 rounded-lg shadow-md flex justify-around items-center text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        <FaUsers className="text-2xl text-blue-500" size={14} />
                    </div>
                    <p className="text-sm font-bold text-blue-500">{guestCount === 0 ? '00' : guestCount}</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="ml-4 flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                        <FaUserCheck className="text-2xl text-green-500" size={14} />
                    </div>
                    <p className="text-sm font-bold text-green-500">{attended === 0 ? '00' : attended}</p>
                </div>
                <div className="ml-4 flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                        <FaUserTimes className="text-2xl text-red-500" size={14} />
                    </div>
                    <p className="text-sm font-bold text-red-500">{notAttended === 0 ? '00' : notAttended}</p>
                </div>
            </div>
        </section>
    );
}
