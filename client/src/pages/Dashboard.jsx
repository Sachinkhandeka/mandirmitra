import { Helmet } from "react-helmet-async";
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
const DashInventories = React.lazy(()=> import("../components/dash/DashInventories"));
const DashEvents = React.lazy(()=> import("../components/dash/DashEvents"));
const DashSeva = React.lazy(()=> import("../components/dash/DashSeva"));
const DashAddress = React.lazy(()=> import("../components/dash/DashAddress"));
const DashAssets = React.lazy(() => import("../components/dash/DashAssets"));
const DashTenants = React.lazy(() => import("../components/dash/DashTenants"));
const DashTempleInsights = React.lazy(()=> import("../components/dash/DashTempleInsights"));

import DashSidebar from "../components/dash/DashSidebar";
import Header from "../components/Header";
import DashSidebarIcons from "../components/dash/DashSidebarIcons";
import FooterComp from "../components/FooterComp";
import About from "../components/About";
import PrivacyPolicy from "../components/ProvacyPolicy";
import Terms from "../components/Terms";

export default function Dashboard() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);

    // Check if the URL is exactly "/"
    const isHomePage = location.pathname === "/dashboard";

    // Function to toggle sidebar visibility
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabUrl = urlParams.get("tab");
        if (tabUrl) {
            setTab(tabUrl);
        }
    }, [location.search]);

    // Determine the title and description based on the current tab
    const getTitle = () => {
        switch (tab) {
            case "profile":
                return "Profile - MadirMitra Dashboard";
            case "daans":
                return "Donations - MadirMitra Dashboard";
            case "expenses":
                return "Expenses - MadirMitra Dashboard";
            case "events":
                return "Events - MadirMitra Dashboard";
            case "seva":
                return "Seva - MadirMitra Dashboard";
            case "address":
                return "Address - MadirMitra Dashboard";
            case "users":
                return "Users - MadirMitra Dashboard";
            case "roles":
                return "Roles - MadirMitra Dashboard";
            case "permissions":
                return "Permissions - MadirMitra Dashboard";
            case "about":
                return "About - MadirMitra Dashboard";
            case "privacy":
                return "Privacy Policy - MadirMitra Dashboard";
            case "terms":
                return "Terms & Conditions - MadirMitra Dashboard";
            default:
                return "Home - MadirMitra Dashboard";
        }
    };

    const getDescription = () => {
        switch (tab) {
            case "profile":
                return "Manage your profile details, create donations, expenses, events, Seva activities, addresses, user roles, and permissions in mandirmitra Dashboard.";
            case "daans":
                return "View, edit, delete, and search donations with advanced functionalities in mandirmitra Dashboard.";
            case "expenses":
                return "View, edit, delete, and search expense records in mandirmitra Dashboard.";
            case "events":
                return "View, edit, delete, and search event details in mandirmitra Dashboard.";
            case "seva":
                return "View, edit, delete, and search Seva activities and volunteer details in mandirmitra Dashboard.";
            case "address":
                return "View, edit, delete, and search address details in mandirmitra Dashboard.";
            case "users":
                return "View, edit, delete, and search user details with advanced functionalities in mandirmitra Dashboard.";
            case "roles":
                return "View, edit, delete, user roles in mandirmitra Dashboard.";
            case "permissions":
                return "View, edit, delete, permissions in mandirmitra Dashboard.";
            case "about":
                return "Learn more about mandirmitra Dashboard, its features, and functionalities.";
            case "privacy":
                return "Read the privacy policy of mandirmitra Dashboard to understand how we handle your data.";
            case "terms":
                return "Read the terms and conditions of mandirmitra Dashboard to understand the usage policies.";
            default:
                return "Welcome to the mandirmitra Dashboard, your central hub for managing temple activities.";
        }
    };

    return (
        <>
            <Helmet>
                <title>{getTitle()}</title>
                <meta name="description" content={getDescription()} />
                <meta name="keywords" content="mandirmitra, Temple Management, Donations, Expenses, Events, Dashboard, CRUD operations, Search functionality" />
            </Helmet>
            {/* header ... */}
            <Header />
            <div className="flex gap-2">
                {showSidebar ? (
                    <div className="fixed h-full w-64 dark:border-r-gray-700 overflow-y-auto z-10 scrollbar-hidden">
                        <div className="absolute right-2 top-2" onClick={toggleSidebar} >
                            {showSidebar ? <IoIosArrowDropleft size={26} className="text-gray-500 cursor-pointer hover:text-black" /> : <IoIosArrowDropright size={26} className="text-gray-500 cursor-pointer hover:text-black" />}
                        </div>
                        {/* sidebar ... */}
                        <DashSidebar />
                    </div>
                ) : (
                    <div className="fixed h-full w-10 dark:bg-gray-700 overflow-y-auto z-10 scrollbar-hidden">
                        <div className="absolute right-2 top-2" onClick={toggleSidebar} >
                            {showSidebar ? <IoIosArrowDropleft size={26} className="text-gray-500 cursor-pointer hover:text-black" /> : <IoIosArrowDropright size={26} className="text-gray-500 cursor-pointer hover:text-black" />}
                        </div>
                        {/* sidebar with icons */}
                        <DashSidebarIcons />
                    </div>
                )}
                <div className={`${showSidebar ? '' : 'ml-12'} flex-1 overflow-x-auto relative z-0 p-3 h-full min-h-screen`}>
                    {/* Home Page ... */}
                    {isHomePage && !tab && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><Home /></Suspense>}
                    {/* profile ... */}
                    {tab === "profile" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><DashProfile /></Suspense>}
                    {/* analytics ... */}
                    {tab === "analytics" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><Home /></Suspense>}
                    {/* Donations ... */}
                    {tab === "daans" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><DashDonations /></Suspense>}
                    {/* Expenses */}
                    {tab === "expenses" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><DashExpenses /></Suspense>}
                    {/* Inventories */}
                    {tab === "inventories" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><DashInventories /></Suspense>}
                    {/* events */}
                    {tab === "events" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><DashEvents /></Suspense>}
                    {/* assets */}
                    {tab === "assets" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><DashAssets /></Suspense>}
                    {/* tenants */}
                    {tab === "tenants" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><DashTenants /></Suspense>}
                    {/* seva */}
                    {tab === "seva" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><DashSeva /></Suspense>}
                    {/* address */}
                    {tab === "address" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><DashAddress /></Suspense>}
                    {/* temple insights */}
                    {tab === "templeinsights" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><DashTempleInsights /></Suspense>}
                    {/* users */}
                    {tab === "users" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><DashUsers /></Suspense>}
                    {/* roles */}
                    {tab === "roles" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><DashRoles /></Suspense>}
                    {/* permissions */}
                    {tab === "permissions" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><DashPermissions /></Suspense>}
                    {/* About */}
                    {tab === "about" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><About /></Suspense>}
                    {/* Privacy Policy  */}
                    {tab === "privacy" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><PrivacyPolicy /></Suspense>}
                    {/* Terms  & conditions */}
                    {tab === "terms" && <Suspense fallback={
                        <div className="flex justify-center items-center min-h-screen gap-4">
                            <Spinner size={"xl"} />
                            <div>Loading ...</div>
                        </div>
                    }><Terms /></Suspense>}
                    {/* Footer */}
                    <FooterComp />
                </div>
            </div>
        </>
    );
}
