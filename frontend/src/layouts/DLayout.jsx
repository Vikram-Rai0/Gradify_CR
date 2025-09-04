import React from 'react'
import { Outlet } from 'react-router-dom'
import DNavbar from '../components/dashboard/DNavbar'
import DSidebar from '../components/dashboard/DSidebar'

const DLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <DNavbar />
      <div className="flex flex-1 overflow-hidden">
        <DSidebar />   {/* ✅ properly closed */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DLayout
