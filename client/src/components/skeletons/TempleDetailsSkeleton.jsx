import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import TemplePostsSkeleton from "./TemplePostsSkeleton";
export default function TempleDetailsSkeleton() {
    const placeholderTabs = Array.from({ length: 8 });
    return (
        <div className="min-h-full animate-pulse">
            {/* Background image */}
            <div className="relative bg-cover bg-center bg-no-repeat bg-gray-300 dark:bg-gray-700 h-full md:h-52 rounded-lg flex items-center justify-center p-10 m-4 animate-pulse">
                {/* Temple image */}
                <div className="absolute top-1 left-1 z-10">
                    <div className="w-10 h-10 md:w-24 md:h-24 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg"></div>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-6 p-6">
                {/* Temple Image */}
                <div className="flex-shrink-0 w-full md:w-1/3 cursor-pointer bg-gray-300 dark:bg-gray-700 h-52 rounded-lg p-1 animate-pulse">
                    <div className="w-full h-auto max-h-[300px] object-fill rounded-lg bg-gray-300 dark:bg-gray-700"></div>
                </div>

                {/* Temple Info */}
                <div className="flex flex-col w-full md:w-2/3 ">
                    {/* temple name & alternateName  */}
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-3 animate-pulse"></div>
                    <div className="flex items-center gap-2 text-sm my-2">
                        <FaMapMarkerAlt className="mr-2 text-xl text-gray-300 dark:text-gray-700 animate-pulse" />
                        <div className="h-3 w-1/4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                        <FaRegCalendarAlt className="mr-2 text-xl text-gray-300 dark:text-gray-700 animate-pulse" />
                        <div className="h-3 w-1/4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="h-3 w-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>

                    {/* Follow/Unfollow Button (skeleton) */}
                    <div className="h-8 w-32 rounded-lg bg-gray-300 dark:bg-gray-700 animate-pulse my-3"></div>
                </div>
            </div>

            {/* Skeleton for Navigation Tabs */}
            <div className="flex gap-4 overflow-x-auto scrollbar-hidden mx-3">
                {placeholderTabs.map((_, index) => (
                    <div
                        key={index}
                        className="h-4 w-32 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"
                    ></div>
                ))}
            </div>
            <TemplePostsSkeleton />
        </div>
    );
}
