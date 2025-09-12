import React from "react";
import { FaBars } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { SiGoogleclassroom } from "react-icons/si";
import { IoIosPeople } from "react-icons/io";
import { MdOutlineAssignment, MdSpaceDashboard } from "react-icons/md";
import { LuMessageCircleMore } from "react-icons/lu";
import { Link } from "react-router-dom";

const DSidebarL = ({ isOpen, toggle }) => {
    return (
        <div className={`flex flex-col h-full bg-gray-200 transition-all duration-300 ${isOpen ? 'w-60' : 'w-16'}`}>
            {/* Sidebar Header */}
            <div className="flex items-center gap-3 h-14 px-3 border-b">
                <button onClick={toggle} aria-label="Toggle Sidebar">
                    <FaBars className="text-gray-600 text-lg" />
                </button>
                <h1 className="font-bold text-xl text-gray-700">GradifyClass</h1>
            </div>

            {/* Menu Section Label */}
            {isOpen && <h1 className="px-5 pt-4 text-gray-500 font-semibold text-sm">MAIN</h1>}

            {/* Menu Items */}
            <ul className="flex flex-col gap-2 mt-2 px-2">
                <Link to="/dlayout/dashboard">
                    <li className="flex items-center gap-3 p-2 cursor-pointer hover:bg-amber-300 rounded">
                        <MdSpaceDashboard className="text-lg" />
                        {isOpen && <span>Dashboard</span>}
                    </li>
                </Link>
                <li className="flex items-center gap-3 p-2 cursor-pointer hover:bg-amber-300 rounded">
                    <SiGoogleclassroom className="text-lg" />
                    {isOpen && <span>Class</span>}
                </li>
                <Link to="dpeople">
                    <li className="flex items-center gap-3 p-2 cursor-pointer hover:bg-amber-300 rounded">
                        <IoIosPeople className="text-lg" />
                        {isOpen && <span>People</span>}
                    </li>
                </Link>

                <li className="flex items-center gap-3 p-2 cursor-pointer hover:bg-amber-300 rounded">
                    <MdOutlineAssignment className="text-lg" />
                    {isOpen && <span>Assignment</span>}
                </li>
                <li className="flex items-center gap-3 p-2 cursor-pointer hover:bg-amber-300 rounded">
                    <LuMessageCircleMore className="text-lg" />
                    {isOpen && <span>Message</span>}
                </li>
                <li className="flex items-center gap-3 p-2 cursor-pointer hover:bg-amber-300 rounded">
                    <CiUser className="text-lg" />
                    {isOpen && <span>My Profile</span>}
                </li>
            </ul>
        </div>
    );
};

export default DSidebarL;
