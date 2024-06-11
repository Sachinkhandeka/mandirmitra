import React, { Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import { Spinner } from "flowbite-react";

const Home = React.lazy(()=> import("../components/Home"));
const DashProfile = React.lazy(()=> import("../components/dash/DashProfile"));
const DashUsers = React.lazy(()=> import("../components/dash/DashUsers"));
const DashRoles = React.lazy(()=> import("../components/dash/DashRoles"));
const DashPermissions = React.lazy(()=> import("../components/dash/DashPermissions"));
const DashDonations = React.lazy(()=> import("../components/dash/DashDonations"));
const DashExpenses = React.lazy(()=> import("../components/dash/DashExpenses"));
const DashEvents = React.lazy(()=> import("../components/dash/DashEvents"));
const DashSeva = React.lazy(()=> import("../components/dash/DashSeva"));
const DashAddress = React.lazy(()=> import("../components/dash/DashAddress"));

import DashSidebar from "../components/dash/DashSidebar";
import Header from "../components/Header";
import DashSidebarIcons from "../components/dash/DashSidebarIcons";
import FooterComp from "../components/FooterComp";
import About from "../components/About";
import PrivacyPolicy from "../components/ProvacyPolicy";
import Terms from "../components/Terms";


export default function Dashboard() {
    const location = useLocation();
    const [ tab , setTab ] = useState('');
    const [showSidebar, setShowSidebar] = useState(false); 
     
    // Check if the URL is exactly "/"
    const isHomePage = location.pathname === "/";

    // Function to toggle sidebar visibility
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    useEffect(()=> {
        const urlParams = new URLSearchParams(location.search);
        const tabUrl = urlParams.get("tab");
        if(tabUrl) {
            setTab(tabUrl);
        }
    }, [ location.search ]);
    return  (
        <>
            {/* header ... */}
            <Header />
            <div className="flex gap-2">
                { showSidebar ? (
                    <div className="fixed h-full w-64 dark:border-r-gray-700 overflow-y-auto z-10 scrollbar-hidden">
                        <div className="absolute right-2 top-2" onClick={toggleSidebar} >
                            { showSidebar ? <IoIosArrowDropleft size={26} className="text-gray-500 cursor-pointer hover:text-black" /> :<IoIosArrowDropright size={26} className="text-gray-500 cursor-pointer hover:text-black"  />  }
                        </div>
                        {/* sidebar ... */}
                        <DashSidebar />
                    </div>
                ) : (
                    <div className="fixed h-full w-10 dark:bg-gray-700 overflow-y-auto z-10 scrollbar-hidden">
                        <div className="absolute right-2 top-2" onClick={toggleSidebar} >
                            { showSidebar ? <IoIosArrowDropleft size={26} className="text-gray-500 cursor-pointer hover:text-black"  /> : <IoIosArrowDropright size={26} className="text-gray-500 cursor-pointer hover:text-black "  />  }
                        </div>
                        {/* sidebar with icons */}
                        <DashSidebarIcons />
                    </div>
                ) }
                <div className={`${showSidebar ? '': 'ml-12' } flex-1 overflow-x-auto relative z-0 p-3 h-full min-h-screen`}>
                    {/* Home Page ... */}
                    { isHomePage && !tab && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4" >
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    } ><Home /></Suspense> }
                    {/* profile ... */}
                    { tab === "profile" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4" >
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    } ><DashProfile /></Suspense> }
                    
                    {/* Donations ... */}
                    { tab === "daans" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4" >
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    } ><DashDonations /></Suspense> }
                    {/* Expenses */}
                    { tab === "expenses" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4" >
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    } ><DashExpenses /></Suspense> }
                    {/* events */}
                    { tab === "events" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4" >
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    } ><DashEvents /></Suspense> }
                    {/* seva */}
                    { tab === "seva" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4" >
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><DashSeva /></Suspense> }
                    {/* address */}
                    { tab === "address" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4" >
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><DashAddress /></Suspense> }
                    {/* users */}
                    { tab === "users" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4" >
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    } ><DashUsers /></Suspense> }
                    {/* roles */}
                    { tab === "roles" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4" >
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><DashRoles /></Suspense> }
                    {/* permissions */}
                    { tab === "permissions" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4" >
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><DashPermissions /></Suspense> }
                    {/* About */}
                    { tab === "about" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4" >
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><About /></Suspense> }
                    {/* Privacy Policy  */}
                    { tab === "privacy" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4" >
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><PrivacyPolicy /></Suspense> }
                    {/* Terms  & conditions */}
                    { tab === "terms" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4" >
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><Terms /></Suspense> }
                    {/* Footer */}
                    <FooterComp /> 
                </div>   
            </div>
        </>
    );
}