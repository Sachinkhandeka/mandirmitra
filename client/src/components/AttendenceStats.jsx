import { FaUserCheck, FaUserTimes, FaUsers } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

// Utility function to format numbers
function formatNumber(num) {
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1) + 'b';
    } else if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1) + 'm';
    } else if (num >= 1_000) {
        return (num / 1_000).toFixed(1) + 'k';
    } else {
        return num;
    }
}

export default function AttendanceStats({ guestCount, attended, notAttended }) {
    return (
        <section className="attendance-stats">
            <Helmet>
                <title>Event Attendance Statistics</title>
                <meta name="description" content="View attendance statistics for event guests, including total guests, attendees, and non-attendees." />
            </Helmet>
            <div className="mt-4 w-full py-6 px-8 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl shadow-2xl flex justify-around items-center text-center">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-full shadow-lg">
                        <FaUsers className="text-xl text-white" />
                    </div>
                    <p className="text-lg font-extrabold text-white">{formatNumber(guestCount)}</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-full shadow-lg">
                        <FaUserCheck className="text-xl text-white" />
                    </div>
                    <p className="text-lg font-extrabold text-white">{formatNumber(attended)}</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-full shadow-lg">
                        <FaUserTimes className="text-xl text-white" />
                    </div>
                    <p className="text-lg font-extrabold text-white">{formatNumber(notAttended)}</p>
                </div>
            </div>
        </section>
    );
}
