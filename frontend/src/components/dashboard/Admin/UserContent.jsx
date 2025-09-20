import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

export default function UsersContent() {
  const [users, setUsers] = useState([]);
  const [openRow, setOpenRow] = useState(null); // Track which row's actions are open
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);

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

  // Close open row when clicking outside the table area
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenRow(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Toggle row actions
  const toggleRow = (userId, e) => {
    e?.stopPropagation(); // prevent the document click handler from immediately closing it
    setOpenRow((prev) => (prev === userId ? null : userId));
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
        setUsers((prev) =>
          prev.map((u) =>
            u.user_id === updateUser.user_id ? { ...u, status: updateUser.status } : u
          )
        );
      })
      .catch((err) => console.error(err));
  };

  // Derived, filtered users based on search query
  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const role = (u.role || "").toLowerCase();
      const status = (u.status || "").toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        role.includes(q) ||
        status.includes(q)
      );
    });
  }, [users, searchQuery]);

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add New User
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by name, email, role or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          onClick={() => setSearchQuery("")}
          className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Clear
        </button>
      </div>

      {/* Students Table */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Students</h3>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        <div className="overflow-x-auto pb-8">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 text-sm">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Promote</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.user_id} className="border-b border-gray-100 text-sm">
                    <td className="py-3 px-4">{u.name}</td>
                    <td className="py-3 px-4">{u.email}</td>

                    <td className="py-3 px-4">
                      <span
                        className={`rounded-full text-xs font-medium inline-block px-2 py-1
                          ${u.role === "Admin" ? "text-red-500" : ""}
                          ${u.role === "Instructor" ? "text-blue-600" : ""}
                          ${u.role === "Student" ? "text-gray-400" : ""}
                          ${u.role === "Supervisor" ? "text-purple-700" : ""}`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3 px-4 flex items-center gap-2">{u.status === "active" ? "🟢 Active" : "🔴 Inactive"}</td>

                    <td className="py-3 px-4">
                      <label className="inline-flex items-center cursor-pointer relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={u.status === "active"}
                          onChange={() => toggleStatus(u)}
                        />
                        <div
                          className="w-10 h-5 border-none bg-gray-300 rounded-full peer-checked:bg-green-400 relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"
                        />
                      </label>
                    </td>

                    <td className="py-3 px-4 flex items-center gap-2 relative">
                      {/* Dots icon to toggle actions */}
                      <button
                        onClick={(e) => toggleRow(u.user_id, e)}
                        data-row-id={u.user_id}
                        className="cursor-pointer text-gray-600 text-lg p-1 rounded-md hover:bg-gray-100"
                        aria-expanded={openRow === u.user_id}
                        aria-controls={`row-actions-${u.user_id}`}
                      >
                        <HiOutlineDotsHorizontal />
                      </button>

                      {/* Show buttons only if this row is open */}
                      {openRow === u.user_id && (
                        <div
                          id={`row-actions-${u.user_id}`}
                          className="absolute right-0 mt-10 flex flex-col gap-1 bg-white border border-gray-100 rounded-md shadow-md p-2 w-32 z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button className="text-blue-500 hover:text-blue-800 hover:bg-blue-100 hover:rounded-lg text-sm font-medium text-left px-2 py-1">
                            Edit
                          </button>
                          <hr className="text-gray-300 my-0.5" />
                          <button className="text-red-500 hover:text-red-600 hover:bg-red-100 hover:rounded-lg text-sm font-medium text-left px-2 py-1">
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-3 text-gray-500">
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
}
