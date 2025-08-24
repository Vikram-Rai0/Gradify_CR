import React, { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa6";
import { SiGoogleclassroom } from "react-icons/si";
import { IoIosAdd } from "react-icons/io";
import LogoutUser from "./LogoutUser";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  const toggleOpen = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleJoinClass = () => {
    setIsOpen(false);
    navigate("/join-class");
  };

  const handleCreateClass = () => {
    setIsOpen(false);
    navigate("/create-class");
  };

  return (
    <header className="relative bg-white shadow-sm">
      <nav className="flex items-center justify-between h-16 px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <FaBars
            className="text-lg cursor-pointer text-gray-700 hover:text-blue-500 transition"
            onClick={toggleSidebar}
          />
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <SiGoogleclassroom className="text-2xl text-green-600" />
            <span className="text-xl font-semibold text-blue-800">
              Classroom
            </span>
          </div>
        </div>


        <div className="flex items-center gap-6">
          <LogoutUser />


          <div className="relative">
            <button
              onClick={toggleOpen}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <IoIosAdd className="text-3xl text-gray-700" />
            </button>


            {isOpen && (
              <div
                ref={popupRef}
                className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50 animate-fadeIn"
              >
                <button
                  onClick={handleJoinClass}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                >
                  Join Class
                </button>
                <button
                  onClick={handleCreateClass}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                >
                  Create Class
                </button>
              </div>
            )}
          </div>


          <div className="h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold cursor-pointer">
            U
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
