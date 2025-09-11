import DLayout from '../../../layouts/DLayout'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {

        const countResult = await axios.get(
          "http://localhost:5000/api/user/countUser",
          { withCredentials: true }
        );
        console.log(countResult.data);
        setUsers(countResult.data);

      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []); // run only once when component mounts

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {users.map((u, i) => (
          <li key={i}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
