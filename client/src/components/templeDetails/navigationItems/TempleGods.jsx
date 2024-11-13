import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import EmptyState from "../../EmptyState";
import { useState } from "react";

export default function TempleGods({ gods }) {
    const [ showMore, setShowMore ] = useState({});

    const toggleShowMore = (index)=> {
        setShowMore((prev)=> ({
            ...prev,
            [index] : !prev[index]
        }));
    }
    return (
        <section className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            {gods && gods.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gods.map((god, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <img
                                src={god.image}
                                alt={god.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="p-4">
                                <div className="flex items-center justify-between my-4" >
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {god.name}
                                    </h3>
                                    <span 
                                        className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2"
                                        onClick={()=> toggleShowMore(index)} 
                                    >
                                        { showMore[index] ? <IoIosArrowUp /> : <IoIosArrowDown /> }
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    { showMore[index] ? god.description : `${god.description.slice(0,100)}...`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState message={'No Gods and Goddesses information available for this temple!'} />
            )}
        </section>
    );
}
