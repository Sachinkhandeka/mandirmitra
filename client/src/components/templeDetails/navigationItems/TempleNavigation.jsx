import React, { useState, Suspense } from "react";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";

// skeleton components
import TempleAboutSkeleton from "../../skeletons/TempleAboutSkeleton";
import TemplePostsSkeleton from "../../skeletons/TemplePostsSkeleton";
import TempleFestivalsSkeleton from "../../skeletons/TempleFestivalsSkeleton";
import TempleVideosSkeleton from "../../skeletons/TempleVideosSkeleton";
import TemplePhotosSkeleton from "../../skeletons/TemplePhotosSkeleton";
import TempleGodSkeleton from "../../skeletons/TempleGodsSkeleton";
import TemplePujarisSkeleton from "../../skeletons/TemplePujarisSkeleton";
import TempleManagementSkeleton from "../../skeletons/TempleManagmentSkeleton";

// Lazy loading components
const TempleAbout = React.lazy(() => import("./TempleAbout"));
const TemplePosts = React.lazy(() => import("./TemplePosts"));
const TempleFestivals = React.lazy(() => import("./TempleFestivals"));
const TempleVideos = React.lazy(() => import("./TempleVideos"));
const TemplePhotos = React.lazy(() => import("./TemplePhotos"));
const TempleGods = React.lazy(() => import("./TempleGods"));
const TemplePujaris = React.lazy(() => import("./TemplePujaris"));
const TempleManagement = React.lazy(() => import("./TempleManagment"));

// Navigation Items
const navigationItems = [
    { label: "Posts", path: "posts" },
    { label: "Videos", path: "videos" },
    { label: "Photos", path: "photos" },
    { label: "Festivals", path: "festivals" },
    { label: "Gods", path: "gods" },
    { label: "Pujaris", path: "pujaris" },
    { label: "Managment", path: "managment" },
    { label: "About", path: "about" },
];

// Loading Spinner Component
const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
    </div>
);

export default function TempleNavigation({ temple }) {
    const { id } = useParams();
    const location = useLocation();

    return (
        <div>
            {/* Navigation Tabs */}
            <div
                className="flex items-center gap-4 overflow-x-auto scrollbar-hidden mx-3"
                role="tablist"
                aria-label="Navigation Items"
            >
                {navigationItems.map((item) => (
                    <Link
                        to={`/temple/${id}/${item.path}`} // Generate dynamic URL based on navigation item
                        className={`flex items-center pl-3 cursor-pointer
                            hover:bg-indigo-100 hover:text-indigo-800 me-2 px-2.5 py-0.5 rounded-full hover:dark:bg-indigo-900 hover:dark:text-indigo-300 
                            ${
                                location.pathname.includes(item.path)
                                ? "bg-blue-100 text-blue-800 me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 border border-blue-400"
                                : "text-gray-600 dark:text-gray-400"
                            } 
                            text-lg font-semibold my-2 px-3 whitespace-nowrap`
                        }
                        key={item.path}
                  >
                    {item.label}
                  </Link>
                ))}
            </div>

            {/* Render Active Component Based on Route */}
            <div className="md:p-2">
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route path="posts" element={
                            <Suspense fallback={<TemplePostsSkeleton />}>
                                <TemplePosts templeId={temple._id} templeName={temple.name} />
                            </Suspense>
                        } />
                        <Route path="videos" element={
                            <Suspense fallback={<TempleVideosSkeleton />}>
                                <TempleVideos videos={temple.videos} templeId={temple._id} templeName={temple.name} />
                            </Suspense>
                        } />
                        <Route path="photos" element={
                            <Suspense fallback={<TemplePhotosSkeleton />}>
                                <TemplePhotos
                                    photos={[
                                        ...temple.historyImages,
                                        ...temple.festivals.flatMap(
                                        (festival) => festival.festivalImages
                                        ),
                                    ]}
                                    templeId={temple._id}
                                    templeName={temple.name}
                                />
                            </Suspense>
                        } />
                        <Route path="festivals" element={
                            <Suspense fallback={<TempleFestivalsSkeleton />}>
                                <TempleFestivals festivals={temple.festivals} templeId={temple._id} templeName={temple.name} />
                            </Suspense>
                        } />
                        <Route path="gods" element={
                            <Suspense fallback={<TempleGodSkeleton />}>
                                <TempleGods gods={temple.godsAndGoddesses} templeId={temple._id} templeName={temple.name} />
                            </Suspense>
                        } />
                        <Route path="pujaris" element={
                            <Suspense fallback={<TemplePujarisSkeleton />}>
                                <TemplePujaris pujaris={temple.pujaris} templeId={temple._id} templeName={temple.name} />
                            </Suspense>
                        } />
                        <Route path="managment" element={
                            <Suspense fallback={<TempleManagementSkeleton />} >
                                <TempleManagement management={temple.management} templeId={temple._id} templeName={temple.name} />
                            </Suspense>
                            } />
                        <Route path="about" element={
                            <Suspense fallback={<TempleAboutSkeleton />}>
                                <TempleAbout description={temple.description} images={temple.historyImages} templeName={temple.name} /> 
                            </Suspense>
                        }
                        />
                    </Routes>
                </Suspense>
            </div>
        </div>
    );
}
