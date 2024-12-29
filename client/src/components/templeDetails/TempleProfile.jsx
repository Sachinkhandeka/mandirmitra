import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import ShowAnuyayi from "./ShowAnuyayi";
import { useSelector } from "react-redux";
import ViewOnlyStoryModal from "../story/ViewOnlyStoryModal";

export default function TempleProfileSection({ temple, isAnuyayi, loading, onFollowToggle, setAlert }) {
    const [showAnuyayi, setShowAnuyayi] = useState(false);
    const [stories, setStories] = useState([]);
    const [storyModal, setStoryModal] = useState(false);
    const { currUser } = useSelector( state => state.user );
    const isStoriesViewed = stories?.some((story) => 
        story.viewedBy.some((viewer) => viewer._id === currUser._id) 
    );
    
      const getStories = async ()=> {
        setAlert({ type : "", message : "" });
          try {
            const response = await fetch(
                `/api/story/${temple._id}`,
                {
                    method : "GET"
                }
            );
            const data = await response.json();
    
            if(!response.ok) {
              setAlert({ type : "error", message : data.message });
            }
            if(data.stories) {
              setStories(data.stories);
            }
          }catch(error) {
            setAlert({ type : "error", message : error.message });
          }
        }
        useEffect(()=> {
            if(stories.length === 0 && temple._id ) {
                getStories();
            }
    },[temple._id]);

    const handleStoryModal = ()=> {
        if( 0 === stories.length) {
            return setAlert({ type : "warning", message : "Please login to start seeing stories of temples" }) ;
        }
        if(!currUser || !currUser.displayName) {
            return setAlert({ type : "warning", message : "Please login to start seeing stories of temples" });
        }
        setStoryModal(true);
    }

    return (
        <div className="flex flex-col md:flex-row items-start gap-6 p-6">
            {/* Temple Image */}
            <div 
                className={`flex-shrink-0 w-full md:w-1/3 cursor-pointer rounded-lg p-1 
                ${ stories.length > 0 ?  isStoriesViewed ? 'border-2 border-gray-400'  : 'border-2 border-orange-500' : '' }`}
            >
                <img
                    src={temple.image}
                    alt={temple.name}
                    className="cursor-pointer w-full h-auto max-h-[300px] object-fill rounded-lg"
                    onClick={handleStoryModal}
                />
            </div>

            {/* Temple Info */}
            <div className="flex flex-col w-full md:w-2/3">
                <h2
                    className="text-3xl font-extrabold text-gray-900 dark:text-white my-2"
                    id="temple-details-title"
                >
                    {temple.name}
                </h2>
                {temple.alternateName && (
                    <h3 className="text-lg text-gray-600 dark:text-gray-300 my-2">
                        {temple.alternateName}
                    </h3>
                )}
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm my-2">
                    <FaMapMarkerAlt className="mr-2 text-xl" />
                    <span>{temple.location}</span>
                    {temple.foundedYear && (
                        <>
                            <span className="mx-2">•</span>
                            <FaRegCalendarAlt className="mr-2 text-xl" />
                            <span>Founded in {temple.foundedYear}</span>
                        </>
                    )}
                </div>

                <div
                    className="flex items-center text-gray-600 dark:text-gray-400 text-sm my-2 cursor-pointer hover:underline"
                >
                    <span className="mx-2">•</span>
                    <span className="font-semibold" onClick={()=> setShowAnuyayi(true)}>{temple.anuyayi.length} Anuyayi</span>
                </div>

                {/* Follow/Unfollow Button */}
                <button
                    className={`px-6 py-2 my-3 md:max-w-40 font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors
                        ${isAnuyayi ? "bg-gray-400 text-white hover:bg-gray-500" : "bg-orange-500 text-white hover:bg-orange-600"}`}
                    onClick={onFollowToggle}
                    disabled={loading}
                >
                    {loading ? (
                        <Spinner color="failure" size="sm" aria-label="Loading spinner" />
                    ) : isAnuyayi ? (
                        "Anutyaag"
                    ) : (
                        "Anu"
                    )}
                </button>
            </div>
            {showAnuyayi && (
                <ShowAnuyayi
                    anuyayiList={temple.anuyayi}
                    showAnuyayi={showAnuyayi}
                    setShowAnuyayi={setShowAnuyayi}
                />
            )}
            {storyModal && (
                <ViewOnlyStoryModal
                    stories={stories} 
                    setStoryModal={setStoryModal}
                />
            )}
        </div>
    );
}
