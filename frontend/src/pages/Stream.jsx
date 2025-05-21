import React from 'react'
import { useState } from 'react';
import ClassroomPost from '../components/Announcement';


const Stream = () => {

  const [isOpenAnnouncement, setIsOpenAnnouncement] = useState(false);

  const openAnnouncement = () => {
    setIsOpenAnnouncement(true)
  }
  const closeAnnouncement = () => {
    setIsOpenAnnouncement(false);
  }
  return (
    <div className='flex flex-col justify-center items-center '>
      <div className='flex justify-between items-center mt-10 w-267 relative'>
        <div className='border-2 rounded-xl border-gray-500 h-50 w-45'>
          <h1>up comming</h1>
        </div>
        <div className='border-2 rounded-xl border-blue-300 h-55 w-170 '><h1></h1></div>
        <div className='h-55 pt-1'>
          <div className='border-2 rounded-xl border-gray-500 h-25 w-45 '>
            <h1>class Code</h1>
          </div>
        </div>

      </div>
      <div className='gap-4 w-full h-full flex flex-col items-center '>
        {!isOpenAnnouncement && (
          <button onClick={openAnnouncement}>
            <div className="attachemnt border-1 border-green-500  rounded-xl h-19 w-190 mt-2 "><h1>click here for announcement</h1></div>
          </button>
        )}
        {isOpenAnnouncement && (
         
            <ClassroomPost/>
          
        )}

        <div className="postAnnouncement border-2 border-amber-600 h-40 w-180 flex items-end justify-center p-1 rounded-lg">
          <div className=" addcomment border-t-1 h-15 w-full ">
          </div>
        </div>
        <div className="postassignment border-2 border-amber-600 h-40 w-180 flex items-end justify-center p-1 rounded-lg">
          <div className=" addcomment border-t-1 h-15 w-full "></div>
        </div>
      </div>
    </div>
  )
}

export default Stream
