import React from 'react'
import { MdOutlineAssignment } from "react-icons/md";
import { MdClose } from 'react-icons/md';
const ClassWorkNav = ({title}) => {
    return (
        <div>
            <nav className='border-2 h-15 w-full flex justify-between items-center p-5'>
                <ul className='flex gap-5 h-full  items-center '>
                    <li className='text-2xl text-green-500'><MdOutlineAssignment /></li>
                    <li className='text-xl text-gray-600'><h1>{title}</h1></li>
                </ul>
                <div>
                    <button className='border-2 rounded-md h-8 w-20 text-center m-5'>Assign</button>
                    <button className='text-red-600 text-xl '><MdClose /></button>
                </div>
            </nav>
        </div>
    )
}

export default ClassWorkNav;
