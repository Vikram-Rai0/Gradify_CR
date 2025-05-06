import React from 'react';
import { FaBars } from "react-icons/fa6";
import { SiGoogleclassroom } from "react-icons/si";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="flex gap-5 items-center border-b-2 border-[#93BFCF] h-20 px-6">
      <FaBars className="text-xl cursor-pointer" onClick={toggleSidebar} />
      <SiGoogleclassroom className="text-xl text-green-600" />
      <span className="text-2xl text-[#213448]">Classroom</span>
    </nav>
  );
};

export default Navbar;



