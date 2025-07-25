import React, { useEffect, useRef, useState } from 'react';

import { FaBars } from "react-icons/fa6";
import { SiGoogleclassroom } from "react-icons/si";
import { IoIosAdd } from "react-icons/io";
import LogoutUser from './LogoutUser';
const Navbar = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);
  const popupRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    else {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.addEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);
  return (
    <div className='relative'>

      <nav className="flex items-center border-b-2 border-[#93BFCF] h-20 px-6 justify-between ">
        <div className='flex items-center  gap-5'>
          <FaBars className="text-xl cursor-pointer" onClick={toggleSidebar} />
          <SiGoogleclassroom className="text-xl text-green-600 cursor-pointer" />
          <span className="text-2xl text-[#213448] cursor-pointer">Classroom</span>
        </div>
        <div className='flex items-center gap-5'>
          <span><button onClick={toggleOpen}><IoIosAdd className='text-4xl text-gray-700' />{isOpen}</button></span>
          <span><p className='text-green-500'>userProfile</p></span>
        </div>

      </nav>



      {isOpen &&
        (

          <div ref={popupRef} className="openPopup absolute right-32 top-12 flex items-center border-2 border-gray-300 shadow-md bg-gray-50 h-30 w-37 rounded-sm">
            <div>
              <button onClick={toggleOpen} className='h-12 hover:bg-gray-200 w-full border-b border-gray-300'>Join class</button>
              <button onClick={toggleOpen} className='h-12 hover:bg-gray-200 w-full'>Create Class</button>

            </div>

          </div>

        )}
      <LogoutUser />
    </div>


  );
};

export default Navbar;



