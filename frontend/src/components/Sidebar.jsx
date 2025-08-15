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
        "group/sidebar bg-white min-h-screen border-r border-gray-300 transition-all duration-300 ease-in-out overflow-hidden shadow-lg",
        {
          "w-64 shadow-xl": expanded,
          "w-20": !expanded,
        }
      )}
      onMouseEnter={() => !isSidebarLocked && setIsHovered(true)}
      onMouseLeave={() => !isSidebarLocked && setIsHovered(false)}
    >
      <ul className="space-y-2 py-6">
        <Link to="/home" className="block">
          <SidebarItem icon={<MdHome size={26} />} label="Home" expanded={expanded} />
        </Link>
        <Link to="/calender" className="block">
          <SidebarItem icon={<FaRegCalendarAlt size={24} />} label="Calendar" expanded={expanded} />
        </Link>

        <hr className="border-gray-300 mx-4" />

        <Link to="/teaching" className="block">
          <SidebarItem icon={<FaChalkboardTeacher size={24} />} label="Teaching" expanded={expanded} />
        </Link>

        <hr className="border-gray-300 mx-4" />

        <Link to="/settings" className="block">
          <SidebarItem icon={<IoMdSettings size={24} />} label="Settings" expanded={expanded} />
        </Link>
      </ul>
    </aside>
  );
};

const SidebarItem = ({ icon, label, expanded }) => (
  <li
    className={classNames(
      "relative flex items-center gap-5 px-5 py-3 text-gray-700 rounded-l-3xl cursor-pointer transition-colors duration-300 hover:bg-[#7ba7cb] group/item select-none",
      {
        "bg-[#e6eff7] font-semibold text-[#E2EFFF]": expanded,
        "hover:text-[#d8e9fe]": !expanded,
      }
    )}
  >
    <span className="flex-shrink-0 text-gray-500">{icon}</span>
    <span
      className={classNames(
        "whitespace-nowrap transition-opacity duration-300 pointer-events-none select-none",
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
      <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1 text-sm bg-[#cee4fe] text-white rounded-md shadow-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 z-50 whitespace-nowrap select-none">
        {label}
      </span>
    )}
  </li>
);

export default Sidebar;
