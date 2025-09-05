import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DNavbar from "../components/dashboard/DNavbar";
import DSidebarL from "../components/dashboard/DSidebarL";
import DSidebarR from "../components/dashboard/DSidebarR";

const DLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className="flex h-screen w-full">
      {/* Left Sidebar */}
      <DSidebarL isOpen={isSidebarOpen} toggle={toggleSidebar} />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <div className="border-b">
          <DNavbar />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[340px] border-l">
        <DSidebarR />
      </div>
    </div>
  );
};

export default DLayout;
