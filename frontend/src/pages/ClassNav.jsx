import React from 'react'
import { Link } from 'react-router-dom'
const ClassNav = () => {
  return (

    <div className='border-b-1 border-b-gray-300 h-12 '>
      <ul className='flex gap-15 h-[100%] items-center pl-10 text-gray-800 '>
        <Link to="/classNav/stream"><li className=' cursor-pointer'><span>Stream</span></li></Link>
        <Link to="/classNav/classwork"><li className=' cursor-pointer'><span>Classwork</span></li></Link>
        <Link to="/classNav/people"> <li className=' cursor-pointer'><span>People</span></li></Link>
      </ul>

    </div>


  ) 
}

export default ClassNav
