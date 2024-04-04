import { useState } from "react";
import { useLocation } from "react-router-dom";

import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";

import DashContent from "../components/DashContent";
import DashSidebar from "../components/DashSidebar";
import Header from "../components/Header";


export default function Dashboard() {
    const location = useLocation();
    const {  user, templeId } =  location.state ; 
    console.log(user);
    console.log(templeId);
    const [showSidebar, setShowSidebar] = useState(false); 

    // Function to toggle sidebar visibility
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };
    return  (
        <>
            <Header />
            <div className="flex gap-2">
                { showSidebar ? (
                    <div className="fixed h-full w-64 bg-gray-200 overflow-y-auto z-10">
                        <div className="absolute right-2 top-2" onClick={toggleSidebar} >
                            { showSidebar ? <IoIosArrowDropleft size={26} className="text-gray-500 cursor-pointer hover:text-black" /> :<IoIosArrowDropright size={26} className="text-gray-500 cursor-pointer hover:text-black"  />  }
                        </div>
                        <DashSidebar />
                    </div>
                ) : (
                    <div className="fixed h-full w-10 bg-gray-200 overflow-y-auto z-10">
                        <div className="absolute right-2 top-2" onClick={toggleSidebar} >
                            { showSidebar ? <IoIosArrowDropleft size={26} className="text-gray-500 cursor-pointer hover:text-black "  /> : <IoIosArrowDropright size={26} className="text-gray-500 cursor-pointer hover:text-black "  />  }
                        </div>
                    </div>
                ) }
                <div className={`${showSidebar ? ' ml-64': 'ml-12' } flex-1 overflow-x-auto relative z-0 p-3`}>
                    <DashContent />
                </div>

            </div>
        </>
    );
}