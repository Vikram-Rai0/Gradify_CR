import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import ClassNav from "../pages/ClassNav";

const Layout = () => {
  const [isSidebarLocked, setIsSidebarLocked] = useState(false);

  const toggleSidebar = () => setIsSidebarLocked(prev => !prev);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isSidebarLocked={isSidebarLocked} />
        
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

