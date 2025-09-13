import DLayout from "../../../layouts/DLayout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import DatabaseDashboard from "./ResourcesStatus";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [instructorCount, setInstructorCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [supervisorCount, setSupervisorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [totalUser, totalInstructor, totalStudent, totalSupervisor] = await Promise.all([
          axios.get("http://localhost:5000/api/user/totalUserCount", { withCredentials: true }),
          axios.get("http://localhost:5000/api/user/totalInstructorCount", { withCredentials: true }),
          axios.get("http://localhost:5000/api/user/totalStudentCount", { withCredentials: true }),
          axios.get("http://localhost:5000/api/user/totalSupervisorCount", { withCredentials: true })
        ]);

        setUserCount(totalUser.data[0].total_users);
        setInstructorCount(totalInstructor.data[0].total_instructors);
        setStudentCount(totalStudent.data[0].total_students);
        setSupervisorCount(totalSupervisor.data[0].total_supervisors);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user count:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 ${color} flex items-center gap-4`}>
      <div className="p-4 bg-white bg-opacity-25 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-white text-sm font-semibold tracking-wide">{title}</h3>
        <p className="text-white text-3xl font-bold mt-1">{loading ? "..." : value}</p>
      </div>
    </div>
  );

  return (

    <div className="dashboard-container p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Users"
            value={userCount}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            title="Instructors"
            value={instructorCount}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            title="Students"
            value={studentCount}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" /></svg>}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatCard
            title="Supervisors"
            value={supervisorCount}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to your Dashboard</h2>
        <p className="text-gray-600 text-lg">
          This overview provides a quick glance at the user statistics in your system.
          You can see the total number of users, instructors, students, and supervisors at a glance.
        </p>
      </div>
<DatabaseDashboard/>
    </div>

  );
};

export default Dashboard;
