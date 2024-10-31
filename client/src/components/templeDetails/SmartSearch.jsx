import { useState, useEffect, useCallback } from "react";
import { Button } from "flowbite-react";
import { MdOutlineClear } from "react-icons/md";
import _ from "lodash";
import SuggestionCard from "./SuggestionCard";

export default function SmartSearch({ setSmartSearchBar }) {
    const [userInput, setUserInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [cache, setCache] = useState([]); // Cache for storing previously searched results
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Debounced function to handle user input change
    const debouncedSearch = useCallback(
        _.debounce(async (input) => {
            if (input.length < 2) return; // Wait for at least 2 characters

            // Check if result is cached
            if (cache[input]) {
                setSuggestions(cache[input]);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Simulate an API call (replace this with your real API call)
                const response = await fetch(`/api/temple/all?search=${input}`);
                const data = await response.json();

                // On success, update cache and set suggestions
                if (response.ok) {
                    setCache((prevCache) => ({ ...prevCache, [input]: data.temples }));
                    setSuggestions(data.temples);
                } else {
                    throw new Error(data.message || "Failed to fetch suggestions");
                }
            } catch (err) {
                setError("Failed to fetch suggestions");
            } finally {
                setLoading(false);
            }
        }, 500), // Debounce delay of 500ms
        [cache]
    );

    // Handle input changes
    const handleChange = (e) => {
        const value = e.target.value;
        setUserInput(value);
        debouncedSearch(value); // Call the debounced search function
    };

    // Clear suggestions when input is cleared
    useEffect(() => {
        if (!userInput) {
            setSuggestions([]);
        }
    }, [userInput]);

    return (
        <section>
            <div className="p-2 w-full">
                <form
                    type="submit"
                    className="flex items-center justify-center gap-2 p-2 w-full"
                    onSubmit={(e) => e.preventDefault()} // Prevent form submission
                >
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={userInput}
                            onChange={handleChange}
                            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                                focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 
                                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 
                                dark:focus:border-blue-500`}
                            placeholder="Search your temple ..."
                        />
                        {userInput && (
                            <MdOutlineClear
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                                size={24}
                                onClick={() => setUserInput("")} // Clear the input value on click
                            />
                        )}
                    </div>
                    <Button color={"blue"} type="submit">
                        Search
                    </Button>
                </form>

                {/* Loading state */}
                {loading && <p className="text-gray-500 animate-pulse">Loading suggestions...</p>}

                {/* Error handling */}
                {error && <p className="text-red-500">{error}</p>}

                {/* Suggestions list */}
                {suggestions.length > 0 && (
                    <ul className="bg-white dark:bg-gray-700 mt-2 shadow-md rounded-md p-2">
                        <SuggestionCard suggestions={suggestions} userInput={userInput} setSmartSearchBar={setSmartSearchBar} cache={cache} />
                    </ul>
                )}
            </div>
        </section>
    );
}
