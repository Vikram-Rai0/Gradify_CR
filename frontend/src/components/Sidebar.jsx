import React from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutUser from "./LogoutUser";
import { Home, Calendar, Settings, LogOut, GraduationCap } from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
    const location = useLocation();

    const menuItems = [
        { name: "Home", path: "/home", icon: <Home size={20} /> },
        { name: "Calendar", path: "/calendar", icon: <Calendar size={20} /> },
        { name: "Teaching", path: "/teaching", icon: <GraduationCap size={20} /> },
        { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
    ];

    const handleClick = () => {
        if (!isOpen) {
            setIsOpen(true); // expand sidebar on click when collapsed
        }
    };

    return (
        <aside
            className={`
        h-screen bg-white shadow-md border-r border-gray-200
        transition-all duration-300 ease-in-out
        flex flex-col
        ${isOpen ? "w-64" : "w-20"}
      `}
        >
            {/* Header */}
            <div className="p-4 flex border-b border-gray-100">
                <h2
                    className={`text-gray-600 font-bold transition-all duration-300 ${isOpen ? "text-2xl" : "text-xl"
                        }`}
                >
                    {isOpen ? "Classroom" : "C"}
                </h2>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-2 pt-4 overflow-auto">
                <ul className="space-y-1">
                    {menuItems.map((item, idx) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={idx}>
                                <Link
                                    to={item.path}
                                    onClick={handleClick}
                                    className={`
                    relative flex items-center gap-3 p-3 rounded-lg
                    transition-colors duration-200
                    ${isActive
                                            ? "bg-blue-100 text-blue-700 font-medium"
                                            : "hover:bg-gray-100 text-gray-700"
                                        }
                  `}
                                >
                                    {item.icon}
                                    {isOpen && <span>{item.name}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-gray-200">

                <div onClick={handleClick}
                    className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition">

                    {isOpen && <span className="font-medium"> <LogoutUser /></span>}
                </div>
            </div>
        </aside>
    );
}
