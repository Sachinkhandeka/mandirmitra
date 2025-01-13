import { useState } from "react";
import { Link } from "react-router-dom";
import TempleDietySection from "../TempleDietySection";
import TempleFestivalsSection from "../TempleFestivalsSection";
import TempleGeneralInfoSection from "../TempleGeneralInfoSection";
import TempleManagementSection from "../TempleManagmentSection";
import TemplePostsSection from "../TemplePostSection";
import TemplePujariSection from "../TemplePriestSection";
import TempleVideosSection from "../TempleVideosSection";
import { useSelector } from "react-redux";

export default function TempleAdminNavigation({ temple, setTemple, setAlert }) {
    const { currUser } = useSelector((state) => state.user);
    const [activeNavLink, setActiveNavLink] = useState("posts");

    // Navigation Items
    const navigationItems = [
        { label: "Posts", path: "posts" },
        { label: "Videos", path: "videos" },
        { label: "Festivals", path: "festivals" },
        { label: "Gods", path: "gods" },
        { label: "Pujaris", path: "pujaris" },
        { label: "Managment", path: "managment" },
        { label: "About", path: "about" },
    ];

    // Handle if currUser is not present
    if (!currUser) {
        return (
            <div className="text-center text-red-500">
                <p>You are not authorized to access this section. Please log in.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Navigation Tabs */}
            <div
                className="flex items-center gap-4 overflow-x-auto scrollbar-hidden mx-3"
                role="tablist"
                aria-label="Navigation Items"
            >
                {navigationItems.map((item) => (
                    <span
                        className={`flex items-center pl-3 cursor-pointer
                            hover:bg-indigo-100 hover:text-indigo-800 me-2 px-2.5 py-0.5 rounded-full hover:dark:bg-indigo-900 hover:dark:text-indigo-300 
                            ${
                                item.path === activeNavLink
                                    ? "bg-blue-100 text-blue-800 me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 border border-blue-400"
                                    : "text-gray-600 dark:text-gray-400"
                            } 
                            text-lg font-semibold my-2 px-3 whitespace-nowrap`}
                        key={item.path}
                        onClick={() => setActiveNavLink(item.path)}
                    >
                        {item.label}
                    </span>
                ))}
            </div>

            {/* Conditional Rendering of Sections */}
            <div className="mt-5">
                {activeNavLink === "posts" && (
                    <TemplePostsSection temple={temple} setTemple={setTemple} setAlert={setAlert} />
                )}
                {activeNavLink === "videos" && (
                    <TempleVideosSection temple={temple} setTemple={setTemple} setAlert={setAlert} />
                )}
                {activeNavLink === "festivals" && (
                    <TempleFestivalsSection temple={temple} setTemple={setTemple} setAlert={setAlert} />
                )}
                {activeNavLink === "gods" && (
                    <TempleDietySection temple={temple} setTemple={setTemple} setAlert={setAlert} />
                )}
                {activeNavLink === "pujaris" && (
                    <TemplePujariSection temple={temple} setTemple={setTemple} setAlert={setAlert} />
                )}
                {activeNavLink === "managment" && (
                    <TempleManagementSection temple={temple} setTemple={setTemple} setAlert={setAlert} />
                )}
                {activeNavLink === "about" && (
                    <TempleGeneralInfoSection temple={temple} setAlert={setAlert} />
                )}
            </div>
        </div>
    );
}