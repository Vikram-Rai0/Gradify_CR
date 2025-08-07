import React, { useState } from "react";
import { MdHome } from "react-icons/md";
import { FaRegCalendarAlt, FaChalkboardTeacher } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import classNames from "classnames";
import { Link } from "react-router-dom";

const Sidebar = ({ isSidebarLocked }) => {
  const [isHovered, setIsHovered] = useState(false);
  const expanded = isSidebarLocked || isHovered;

  return (
    <aside
      className={classNames(
        "group/sidebar bg-gray-100 min-h-screen border-r border-gray-200  transition-all duration-300 ease-in-out overflow-hidden shadow-md",
        {
          "w-65 shadow-2xl": expanded,
          "w-20": !expanded,
        }
      )}
      onMouseEnter={() => !isSidebarLocked && setIsHovered(true)}
      onMouseLeave={() => !isSidebarLocked && setIsHovered(false)}
    >
      <ul className="space-y-2 py-6 ">

        <Link to="/home"> <SidebarItem icon={<MdHome size={24} />} label="Home" expanded={expanded} /></Link>
        <Link to="/calender">  <SidebarItem icon={<FaRegCalendarAlt size={22} />} label="Calendar" expanded={expanded} /></Link>
        <hr className="border-gray-300" />
        <Link to="/teaching"><SidebarItem icon={<FaChalkboardTeacher size={22} />} label="Teaching" expanded={expanded} /></Link>
        <hr className="border-gray-300" />
        <Link to="/settings"><SidebarItem icon={<IoMdSettings size={22} />} label="Settings" expanded={expanded} /></Link>
      </ul>
    </aside>
  );
};

const SidebarItem = ({ icon, label, expanded }) => (
  <li className="relative flex items-center gap-4 px-4 py-2 text-gray-700 hover:bg-[#E3F4F4] rounded-r-3xl rounded-l-lg transition-colors duration-300 cursor-pointer group/item">
    <span className="text-gray-700 flex pl-2.5">{icon}</span>
    <span
      className={classNames(
        "whitespace-nowrap transition-opacity duration-300 pointer-events-none",
        {
          "opacity-100": expanded,
          "opacity-0": !expanded,
        }
      )}
    >
      {label}
    </span>

    {/* Tooltip for collapsed mode */}
    {!expanded && (
      <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-sm bg-gray-800 text-white rounded shadow-md opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 z-50 whitespace-nowrap">
        {label}
      </span>
    )}
  </li>
);

export default Sidebar;
