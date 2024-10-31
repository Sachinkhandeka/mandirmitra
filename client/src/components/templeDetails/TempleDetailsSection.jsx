import { Avatar } from "flowbite-react";
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import { useState } from "react";
import TempleDescription from "./navigationItems/TempleDescription";
import TempleFestivals from "./navigationItems/TempleFestivals";
import TemplePhotos from "./navigationItems/TemplePhotos";
import TempleGods from "./navigationItems/TempleGods";
import TemplePujaris from "./navigationItems/TemplePujaris";
import TempleManagement from "./navigationItems/TempleManagment";

const navigationItems = ['About', 'Festivals', 'Photos', 'Gods', 'Pujaris', 'Managment', 'Nearby Temples'];

export default function TempleDetailsSection({ temple }) {
    const [ activeNavItem, setActiveNavItem ] = useState('About');

    return (
        <section className="text-black dark:text-white min-h-screen mb-8">
                <div className="flex gap-6 p-6">
                    <div>
                        <div className="flex gap-3" >
                            <Avatar img={temple.image} size={"lg"} rounded />
                            <div className="flex flex-col" >
                                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white my-2">
                                    {temple.name}
                                </h2>
                                <h3 className="text-lg text-gray-600 dark:text-gray-300 my-2">
                                    {temple.alternateName}
                                </h3>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm my-2">
                            <FaMapMarkerAlt className="mr-2 text-xl" />
                            <span>{temple.location}</span>
                            {temple.foundedYear && (
                                <>
                                    <span className="mx-2">•</span>
                                    <FaRegCalendarAlt className="mr-2 text-xl" />
                                    <span>Founded {temple.foundedYear}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 overflow-x-scroll scrollbar-hidden mx-3" >
                    { navigationItems.map( item => (
                        <h3 className={`flex items-center pl-3 cursor-pointer
                            hover:bg-indigo-100 hover:text-indigo-800 me-2 px-2.5 py-0.5 rounded-full hover:dark:bg-indigo-900 hover:dark:text-indigo-300 
                            ${activeNavItem === item ? 'bg-blue-100 text-blue-800 me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 border border-blue-400' 
                                : 'text-gray-600 dark:text-gray-400'} 
                            text-lg font-semibold my-2 px-3 whitespace-nowrap`} 
                            key={item} 
                            onClick={()=> setActiveNavItem(item)} >
                                {item}
                        </h3>
                    ) ) }
                </div>
                <div className="p-3" >
                    { activeNavItem === "About" && ( <TempleDescription description={temple.description} images={temple.historyImages} /> ) }
                    { activeNavItem === "Festivals" && ( <TempleFestivals festivals={temple.festivals} /> ) }
                    { activeNavItem === "Photos" && ( <TemplePhotos photos={[...temple.historyImages, ...temple.festivals.flatMap(festival => festival.festivalImages)]} /> ) }
                    { activeNavItem === "Gods" && ( <TempleGods gods={temple.godsAndGoddesses} /> ) }
                    { activeNavItem === "Pujaris" && ( <TemplePujaris pujaris={temple.pujaris} /> ) }
                    { activeNavItem === "Managment" && ( <TempleManagement management={temple.management} /> ) }
                </div>
        </section>
    );
}
