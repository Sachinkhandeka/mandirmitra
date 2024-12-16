import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import EmptyState from "../../EmptyState";
import { useState } from "react";
import { FaRegShareSquare } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import Alert from "../../Alert";
import EntityLikeButton from "../EntityLikeButton";

export default function TempleGods({ gods, templeId }) {
    const [ showMore, setShowMore ] = useState({});
    const [ alert, setAlert ] = useState({ type : "", message : "" });

    const toggleShowMore = (index)=> {
        setShowMore((prev)=> ({
            ...prev,
            [index] : !prev[index]
        }));
    }

    const handleShare = (god)=> {
        const truncatedDesc = god.description.lenght > 150 ? 
            god.description.subString(0, 150) + "..." :
            god.description ; 
        const currentUrl = window.location.href ; 
        
        if(navigator.share) {
            navigator.share({
                title : god.name,
                text : truncatedDesc,
                url : currentUrl
            })
            .then(()=> {setAlert({ type: "success", message: "God card shared successfully!" });})
            .catch(()=> {setAlert({ type: "error", message: `Failed to share: ${error.message}` });})
        } else {
            const shareText = `${god.name}: ${truncatedDesc}\n\nCheck it out here: ${currentUrl}`
            navigator.clipboard
            .writeText(shareText)
            .then(()=> {setAlert({ type: "success", message: "Shareable link copied to clipboard!" });})
            .catch((error)=>{setAlert({ type: "error", message: `Failed to copy link: ${error.message}` });});
        }

    }
    return (
        <section className="p-1 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert({ type: "", message: "" })} />
                )}
            </div>
            {gods && gods.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gods.map((god, index) => (
                        <div 
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-transparent 
                            hover:border-2 hover:border-t-0 hover:border-l-0 hover:border-black hover:dark:border-yellow-300 
                            transition-all duration-500 ease-in-out"
                        >
                            <img
                                src={god.image}
                                alt={god.name}
                                className="w-full h-60 object-fill rounded-t-lg"
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
                                <div className="flex justify-between items-center px-4 py-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-4">
                                        {/* Likes */}
                                        <EntityLikeButton 
                                            entityType={"godsAndGoddesses"} 
                                            entityId={god._id} 
                                            setAlert={setAlert}
                                            templeId={templeId} 
                                        />
                                    </div>
                                    {/* Share */}
                                    <div
                                        onClick={()=> {handleShare(god)}}
                                        className="flex items-center justify-center cursor-pointer gap-1 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        <FaRegShareSquare className="text-lg" />
                                    </div>
                                </div>
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
