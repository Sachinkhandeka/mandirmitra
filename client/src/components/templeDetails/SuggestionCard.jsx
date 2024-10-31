import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";

export default function SuggestionCard({ suggestions, userInput, setSmartSearchBar, cache }) {
    
    // Highlight the matched part of the suggestion
    const highlightMatch = (text, query) => {
        const regex = new RegExp(`(${query})`, "gi");
        const parts = text.split(regex);
        return (
            <span>
                {parts.map((part, index) =>
                    part.toLowerCase() === query.toLowerCase() ? (
                        <span key={index} className="text-blue-600 font-bold">
                            {part}
                        </span>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    // Ensure cache[userInput] is an array, fallback to suggestions if cache is empty
    const cachedSuggestions = Array.isArray(cache[userInput]) ? cache[userInput] : suggestions;

    return (
        <div className="mt-4">
            <ul className="space-y-4">
                {cachedSuggestions.length > 0 && cachedSuggestions.map((suggestion, index) => (
                    <li key={index} className="group">
                        <Link 
                            to={`/temple/${suggestion._id}`} 
                            onClick={() => setSmartSearchBar(false)}
                            className="block p-1 bg-white dark:bg-gray-800 hover:bg-blue-100 hover:dark:bg-gray-600 rounded-lg">
                            
                            {/* Suggestion Card Content */}
                            <div className="flex items-center gap-4">
                                {/* Temple Image */}
                                <img
                                    src={suggestion.image}
                                    alt={suggestion.name || 'Temple Image'}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />

                                {/* Temple Information */}
                                <div className="flex flex-col items-start">
                                    {/* Temple Name */}
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                        {highlightMatch(suggestion.name || 'Unknown Temple', userInput)}
                                    </h3>

                                    {/* Alternate Name */}
                                    {suggestion.alternateName && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                            ({highlightMatch(suggestion.alternateName, userInput)})
                                        </p>
                                    )}

                                    {/* Location & Founded Year */}
                                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {suggestion.location && (
                                            <p className="truncate flex gap-1 items-center">
                                                <FaMapMarkerAlt /> 
                                                {highlightMatch(suggestion.location, userInput)}
                                            </p>
                                        )}
                                        {suggestion.foundedYear && (
                                            <p className="ml-2 flex gap-1 items-center">
                                                <span className="mx-1">•</span> 
                                                <FaRegCalendarAlt />
                                                {suggestion.foundedYear}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
