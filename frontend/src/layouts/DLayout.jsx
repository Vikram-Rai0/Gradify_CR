// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import DNavbar from "../components/dashboard/DNavbar";
// import DSidebarL from "../components/dashboard/DSidebarL";
// import DSidebarR from "../components/dashboard/DSidebarR";

// const DLayout = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

//   return (
//     <div className="flex h-screen w-full">
//       {/* Left Sidebar */}
//       <DSidebarL isOpen={isSidebarOpen} toggle={toggleSidebar} />

//       {/* Main Content */}
//       <div className="flex flex-col flex-1">
//         {/* Navbar */}
//         <div className="border-b">
//           <DNavbar />
//         </div>

//         {/* Page Content */}
//         <div className="flex-1 overflow-auto p-4">
//           <Outlet />
//         </div>
//       </div>

//       {/* Right Sidebar */}
//       <div className="w-[340px] border-l">
//         <DSidebarR />
//       </div>
//     </div>
//   );
// };

// export default DLayout;

import React, { useState } from "react";
import { Menu } from "lucide-react";
import DashboardContent from "../components/dashboard/Admin/DashboardContent";
import UsersContent from "../components/dashboard/Admin/UserContent";
import PlaceholderContent from "../components/dashboard/Admin/PlaceholderContent";
import DSidebar from "../components/DSidebar";
const DLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard": return <DashboardContent />;
      case "users": return <UsersContent />;
      case "classes": return <PlaceholderContent title="Classes Management" description="Manage all classes, enrollments, and class settings from here." />;
      case "instructors": return <PlaceholderContent title="Instructor Management" description="View and manage instructor accounts, permissions, and activities." />;
      case "students": return <PlaceholderContent title="Student Management" description="Monitor student accounts, enrollments, and academic progress." />;
      case "analytics": return <PlaceholderContent title="System Analytics" description="View detailed analytics and reports about platform usage and performance." />;
      case "reports": return <PlaceholderContent title="Reports" description="Generate and download various reports for administrative purposes." />;
      case "system": return <PlaceholderContent title="System Health" description="Monitor system performance, server status, and technical metrics." />;
      case "database": return <PlaceholderContent title="Database Management" description="Manage database operations, backups, and maintenance tasks." />;
      case "security": return <PlaceholderContent title="Security Settings" description="Configure security policies, access controls, and monitoring." />;
      case "notifications": return <PlaceholderContent title="Notification Center" description="Manage system-wide notifications and communication settings." />;
      case "settings": return <PlaceholderContent title="System Settings" description="Configure global platform settings and preferences." />;
      default: return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DSidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile Top Nav */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-900">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
            <div className="w-6"></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DLayout;

