import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";

export default function SuggestionCardSkeleton () {
    return (
        <div className="min-h-full animate-pulse" >
            {Array(6)
                .fill(0)
                .map((_, index) => (
                <div className="flex items-center gap-4 my-2 bg-gray-200 dark:bg-gray-600 rounded-lg p-2" key={index}>
                    {/* Temple Image */}
                    <span className="w-16 h-16 object-cover bg-gray-400 dark:bg-gray-800 rounded-lg" />
                    {/* Temple Information */}
                    <div className="flex flex-col items-start">
                        {/* Temple Name */}
                        <h3 className="p-1 w-32 rounded-lg bg-gray-400 dark:bg-gray-800 mb-2"></h3>
                
                        {/* Alternate Name */}
                        <p className="h-2 w-24 rounded-lg bg-gray-400 dark:bg-gray-800"></p>
                
                        {/* Location & Founded Year */}
                        <div className="flex items-center mt-4">
                            <p className="h-1 w-full flex gap-1 items-center mx-2">
                                <FaMapMarkerAlt className="text-md w-6 h-6 text-gray-400 dark:text-gray-800 " />
                                <span className="h-1 w-full rounded-lg bg-gray-400 dark:bg-gray-800 mx-2"></span>
                            </p>                             
                            <p className="ml-2 h-1 w-full flex gap-1 items-center">
                                <FaRegCalendarAlt className="text-md w-6 h-6 text-gray-400 dark:text-gray-800" />
                                <span className="h-1 w-full rounded-lg bg-gray-400 dark:bg-gray-800 mx-2"></span>
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}