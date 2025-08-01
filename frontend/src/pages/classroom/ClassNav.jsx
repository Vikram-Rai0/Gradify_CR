import React from 'react'
import { Link, useParams } from 'react-router-dom'

const ClassNav = () => {
  const { classId } = useParams();
  console.log('classId:', classId);

  if (!classId) {
    // Optional: render nothing or fallback if no classId
    return null;
  }

  return (
    <div className='border-b border-b-gray-300 h-12'>
      <ul className='flex gap-6 h-full items-center pl-10 text-gray-800'>
        <li className='cursor-pointer'>
          <Link to={`/class/stream`}>Stream</Link>
        </li>
        <li className='cursor-pointer'>
          <Link to={`/class/classwork`}>Classwork</Link>
        </li>
        <li className='cursor-pointer'>
          <Link to={`/class/people`}>People</Link>
        </li>
      </ul>
    </div>
  )
}

export default ClassNav;
