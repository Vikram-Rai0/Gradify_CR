import React from 'react';
import { MdOutlineAssignment, MdClose } from "react-icons/md";

const ClassWorkNav = ({ title }) => {
  return (
    <nav className=" border-b border-blue-300 bg-white shadow-sm flex justify-between items-center px-6 py-3">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <MdOutlineAssignment className="text-2xl text-green-600" />
        <h1 className="text-lg font-semibold text-gray-600">{title}</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center">
       
        <button className="p-2 hover:bg-red-50 rounded-full transition-colors">
          <MdClose className="text-xl text-red-500" />
        </button>
      </div>
    </nav>
  );
};

export default ClassWorkNav;
