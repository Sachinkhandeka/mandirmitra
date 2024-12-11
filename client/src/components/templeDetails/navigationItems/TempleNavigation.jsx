import React, { useState, Suspense } from "react";

// Lazy loading components
const TempleAbout = React.lazy(() => import("./TempleAbout"));
const TemplePosts = React.lazy(() => import("./TemplePosts"));
const TempleFestivals = React.lazy(() => import("./TempleFestivals"));
const TempleVideos = React.lazy(() => import("./TempleVideos"));
const TemplePhotos = React.lazy(() => import("./TemplePhotos"));
const TempleGods = React.lazy(() => import("./TempleGods"));
const TemplePujaris = React.lazy(() => import("./TemplePujaris"));
const TempleManagement = React.lazy(() => import("./TempleManagment"));

const navigationItems = [
    "Posts",
    "Videos",
    "Photos",
    "Festivals",
    "Gods",
    "Pujaris",
    "Managment",
    "About",
];

// Loading Spinner Component
const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
    </div>
);

export default function TempleNavigation({ temple }) {
    const [activeNavItem, setActiveNavItem] = useState("Posts");

    return (
        <div>
            {/* Navigation Tabs */}
            <div
                className="flex items-center gap-4 overflow-x-auto scrollbar-hidden mx-3"
                role="tablist"
                aria-label="Navigation Items"
            >
                {navigationItems.map((item) => (
                    <h3
                        className={`flex items-center pl-3 cursor-pointer
                        hover:bg-indigo-100 hover:text-indigo-800 me-2 px-2.5 py-0.5 rounded-full hover:dark:bg-indigo-900 hover:dark:text-indigo-300 
                        ${
                            activeNavItem === item
                                ? "bg-blue-100 text-blue-800 me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 border border-blue-400"
                                : "text-gray-600 dark:text-gray-400"
                        } 
                        text-lg font-semibold my-2 px-3 whitespace-nowrap`}
                        key={item}
                        onClick={() => setActiveNavItem(item)}
                        role="tab"
                        aria-selected={activeNavItem === item}
                    >
                        {item}
                    </h3>
                ))}
            </div>

            {/* Render Active Component */}
            <div className="p-3">
                <Suspense fallback={<LoadingSpinner />}>
                    {activeNavItem === "About" && (
                        <TempleAbout
                            description={temple.description}
                            images={temple.historyImages}
                        />
                    )}
                    {activeNavItem === "Posts" && <TemplePosts templeId={temple._id} />}
                    {activeNavItem === "Festivals" && (
                        <TempleFestivals festivals={temple.festivals} templeId={temple._id} />
                    )}
                    {activeNavItem === "Videos" && <TempleVideos videos={temple.videos} templeId={temple._id} />}
                    {activeNavItem === "Photos" && (
                        <TemplePhotos
                            photos={[
                                ...temple.historyImages,
                                ...temple.festivals.flatMap(
                                    (festival) => festival.festivalImages
                                ),
                            ]}
                            templeId={temple._id}
                        />
                    )}
                    {activeNavItem === "Gods" && (
                        <TempleGods gods={temple.godsAndGoddesses} templeId={temple._id} />
                    )}
                    {activeNavItem === "Pujaris" && <TemplePujaris pujaris={temple.pujaris} templeId={temple._id} />}
                    {activeNavItem === "Managment" && (
                        <TempleManagement management={temple.management} templeId={temple._id} />
                    )}
                </Suspense>
            </div>
        </div>
    );
}
