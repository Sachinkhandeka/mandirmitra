import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import moment from "moment";
import { useSelector } from "react-redux";

export default function SlokaComponent({ content, translation, isHighlighted, viewedBy, date }) {
    const { currUser } = useSelector( state => state.user );
    return (
        <div
            className={`relative p-6 rounded-lg shadow-lg bg-gradient-to-r h-full ${
                isHighlighted ? "from-yellow-300 to-orange-400" : "from-gray-100 to-gray-200"
            } text-center`}
        >
            {/* Date at the top-right */}
            {date && moment(date).isValid() && (
                <span className="absolute top-2 left-2 text-sm italic">
                    {moment(date).fromNow()}
                </span>
            )}

            {/* Content with quotes */}
            <div className="text-4xl font-serif text-red-700 mt-4">
                <FaQuoteLeft className="inline-block mr-2 mb-10" />
                {content}
                <FaQuoteRight className="inline-block ml-2 mt-8" />
            </div>

            {/* Translation */}
            {translation && (
                <p className="mt-4 text-lg font-medium text-gray-800 italic">
                    {translation}
                </p>
            )}

            {/* Viewed by with Eye Icon */}
            { currUser && currUser.isAdmin && viewedBy !== undefined && (
                <div className="my-6 text-sm font-medium text-gray-700 flex items-center justify-center gap-2">
                    <IoEyeOutline className="text-gray-700" size={20} />
                    <span>{viewedBy}</span>
                </div>
            ) }
        </div>
    );
};
