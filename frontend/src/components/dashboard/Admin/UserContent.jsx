import { useState, useEffect } from "react";
import axios from "axios";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const UsersContent = () => {
  const [users, setUsers] = useState([]);
  const [openRow, setOpenRow] = useState(null); // Track which row's actions are open

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/getallusers",
          { withCredentials: true }
        );
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getUsers();
  }, []);



  // Toggle row actions
  const toggleRow = (userId) => {
    if (openRow === userId) setOpenRow(null);
    else setOpenRow(userId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add New User
        </button>
      </div>

      {/* Students Table */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Students</h3>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 text-sm">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.user_id} className="border-b border-gray-100 text-sm">
                    <td className="py-3 px-4">{u.name}</td>
                    <td className="py-3 px-4">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      {/* Dots icon to toggle actions */}
                      <button onClick={() => toggleRow(u.user_id)} className="cursor-pointer">
                        <HiOutlineDotsHorizontal />
                      </button>

                      {/* Show buttons only if this row is open */}
                      {openRow === u.user_id && (
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersContent;
