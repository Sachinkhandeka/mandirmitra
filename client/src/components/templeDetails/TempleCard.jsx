import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function TempleCard({ temple }) {
    return (
    <Link to={`/temple/${temple._id}/posts`}>
        <div className="max-w-sm w-full mx-auto md:mx-3 h-96 overflow-hidden">
            {/* Thumbnail (Image) */}
            <div className="relative w-full h-44">
                <img src={temple.image} alt={temple.name} className="w-full h-full object-fill rounded-md" />
            </div>

            {/* Temple Information */}
            <div className="flex p-4">
                {/* Profile Picture or Icon */}
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0">
                    <img src={temple.image} alt="Temple Icon" className="rounded-full object-fill w-full h-full" />
                </div>

                {/* Temple Info */}
                <div className="ml-3 flex-1">
                    {/* Temple Name */}
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white leading-snug mb-1">
                        {temple.name}
                    </h3>

                    {/* Location and Founded Year */}
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs mt-1">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>{temple.location}</span>
                        {temple.foundedYear && (
                            <>
                                <span className="mx-2">•</span>
                                <FaRegCalendarAlt className="mr-1" />
                                <span>{temple.foundedYear}</span>
                            </>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mt-2 mb-4" dangerouslySetInnerHTML={{__html: temple.description
                        ? `${temple.description.slice(0, 80)}...`
                        : "No description available."
                    }}>
                    </p>
                </div>
            </div>
        </div>
    </Link>
    );
}
