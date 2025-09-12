import DLayout from "../../../layouts/DLayout";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [instructorCount, setInstructorCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [supervisorCount, setSupervisorCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const totalUser = await axios.get(
          "http://localhost:5000/api/user/totalUserCount",
          { withCredentials: true }
        );
        const totalInstructor = await axios.get(
          "http://localhost:5000/api/user/totalInstructorCount",
          { withCredentials: true }
        );
        const totalStudent = await axios.get(
          "http://localhost:5000/api/user/totalStudentCount",
          { withCredentials: true }
        );
        const totalSupervisor = await axios.get(
          "http://localhost:5000/api/user/totalSupervisorCount",
          { withCredentials: true }
        );

        // ✅ Set each state separately
        setUserCount(totalUser.data[0].total_users);
        setInstructorCount(totalInstructor.data[0].total_instructors);
        setStudentCount(totalStudent.data[0].total_students);
        setSupervisorCount(totalSupervisor.data[0].total_supervisors);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {userCount}</p>
      <p>Total Instructors: {instructorCount}</p>
      <p>Total Students: {studentCount}</p>
      <p>Total Supervisors: {supervisorCount}</p>
    </div>
  );
};

export default Dashboard;
