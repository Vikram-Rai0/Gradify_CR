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
        console.log(response.data);
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

  const toggleStatus = (clickUser) => {
    axios
      .patch(
        `http://localhost:5000/api/user/${clickUser.user_id}/toggleStatus`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        const updateUser = res.data;
        setUsers(
          users.map((u) =>
            u.user_id === updateUser.user_id
              ? { ...u, status: updateUser.status }
              : u
          )
        );
      })
      .catch((err) => console.error(err));
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
        <div className="overflow-x-auto pb-8">
          <table className="min-w-full ">
            <thead>
              <tr className="border-b border-gray-200 text-sm">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Email
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Role
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Promote
                </th>

                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr
                    key={u.user_id}
                    className="border-b border-gray-100 text-sm"
                  >
                    <td className="py-3 px-4">{u.name}</td>
                    <td className="py-3 px-4">{u.email}</ td>

                    <td className="py-3 px-4">
                      <span
                        className={` rounded-full text-xs font-medium 
    ${u.role === "Admin" ? "text-red-500 " : ""}
    ${u.role === "Instructor" ? "text-blue-600 " : ""}
    ${u.role === "Student" ? "text-gray-400 " : ""}
    ${u.role === "Supervisor" ? "text-purple-700  " : ""}
  `}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex items-center gap-2 ">
                      {u.status === "active" ? "🟢 Active" : "🔴 Inactive"}
                    </td>

                    <td className="py-3 px-4 ">
                      <label className="inline-flex items-center cursor-pointer relative">
                        <input
                          type="checkbox"
                          className="sr-only peer "
                          checked={u.status === "active"}
                          onChange={() => toggleStatus(u)}
                        />
                        <input type="checkbox" className="sr-only peer" />
                        <div
                          className="w-7 h-3 left-3 border-none bg-gray-300 rounded-full peer-checked:bg-green-400 relative
    after:content-[''] after:absolute after:top-0.5 after:left-0.5
    after:bg-white after:border-none after:rounded-full after:h-2 after:w-2 after:transition-all
    peer-checked:after:translate-x-4 "
                        ></div>
                      </label>
                    </td>

                    <td className="py-3 px-4 flex items-center gap-2 relative">
                      {/* Dots icon to toggle actions */}
                      <button
                        onClick={() => toggleRow(u.user_id)}
                        className="cursor-pointer absolute left-7.5 text-gray-600 text-lg "
                      >
                        <HiOutlineDotsHorizontal />
                      </button>

                      {/* Show buttons only if this row is open */}
                      {openRow === u.user_id && (
                        <div className="absolute right-26  mt-14 flex flex-col gap-1 bg-white border border-gray-100 rounded-md shadow-md p-1 w-24 z-10">
                          <button className="text-blue-500 hover:text-blue-800 hover:bg-blue-100 hover:rounded-lg text-sm font-medium">
                            Edit
                          </button>
                          <hr className="text-gray-300" />
                          <button className="text-red-500 hover:text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium">
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
