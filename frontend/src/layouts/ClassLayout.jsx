import React from 'react'
import { Outlet } from 'react-router-dom'
import ClassNav from '../pages/ClassNav'

const ClassLayout = () => {
    return (
        <div className='flex flex-col'>
            <ClassNav />
            <main className="flex-1 overflow-auto bg-gray-50">
                <Outlet />
            </main>
        </div>
    )
}

export default ClassLayout
