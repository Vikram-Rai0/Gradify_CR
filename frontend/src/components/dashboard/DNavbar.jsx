import React from 'react'
import { IoIosSearch } from "react-icons/io";
import { IoNotificationsOutline } from "react-icons/io5";

const DNavbar = () => {
    return (
        <nav className="flex justify-between items-center bg-gray-100  w-full h-14  px-6 gap-7">


            <div className="relative w-full ">

                <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />


                <input
                    type="text"
                    className="w-full py-2 pl-10 pr-4  border-b-1 border-gray-300 focus:outline-none  text-gray-600"
                    placeholder="Search for class"
                />
            </div>

            {/* Notification */}
            <IoNotificationsOutline className="text-2xl text-gray-700 cursor-pointer" />
        </nav>
    )
}

export default DNavbar
