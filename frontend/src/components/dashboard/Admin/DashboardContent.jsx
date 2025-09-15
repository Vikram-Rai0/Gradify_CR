import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Users, BookOpen, GraduationCap, Activity, UserCheck } from "lucide-react";

const DashboardContent = () => {
  const [userCount, setUserCount] = useState(0);
  const [activeClass, setActiveClass] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultCount = await axios.get(
          "http://localhost:5000/api/user/totalUserCount",
          { withCredentials: true }
        );
        setUserCount(resultCount.data[0].total_users);

        const response = await axios.get(
          "http://localhost:5000/api/classroom/countActiveClasses",
          { withCredentials: true }
        );

        console.log(response.data);
        setActiveClass(response.data.active_classes);

      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchData();
  }, []);


  return (

    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 mr-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {userCount === 0 ? "Loading..." : userCount}
              </p>
              <p className="text-sm text-green-600">↑ 12% from last month</p>
            </div>
          </div>
        </div>
        {/* Classes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 mr-4">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Classes</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeClass === null ? "Loading..." : activeClass}
              </p>

              <p className="text-sm text-green-600">↑ 5% from last month</p>
            </div>
          </div>
        </div>
        {/* Instructors */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 mr-4">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Instructors</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-sm text-gray-500">Active this semester</p>
            </div>
          </div>
        </div>
        {/* System Health */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100 mr-4">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className="text-2xl font-bold text-green-600">99.9%</p>
              <p className="text-sm text-gray-500">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New instructor registered</p>
              <p className="text-xs text-gray-600">Dr. Sarah Johnson joined the platform</p>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New class created</p>
              <p className="text-xs text-gray-600">Advanced Database Systems - Fall 2025</p>
            </div>
            <span className="text-xs text-gray-500">4 hours ago</span>
          </div>
          <div className="flex items-center p-3 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
              <UserCheck className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Bulk student enrollment</p>
              <p className="text-xs text-gray-600">25 students enrolled in Computer Science</p>
            </div>
            <span className="text-xs text-gray-500">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );

}


export default DashboardContent;
