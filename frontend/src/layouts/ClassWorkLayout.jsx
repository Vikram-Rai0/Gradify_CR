import React from 'react'
import { Outlet } from 'react-router-dom'
import ClassWorkNav from '../components/classwork/CalssWorkNav'
import ClassWorkSidebar from '../components/ClassWorkSidebar'

const ClassWorkLayout = () => {
    return (
        <div>
            <div className='flex flex-col w-full'>
                <ClassWorkNav />
            </div>
            <div className='flex '>
                <ClassWorkSidebar />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default ClassWorkLayout
