import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignmentUsers = ({ classId, assignId }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/classwork/${classId}/submitAssignment/${assignId}`,
                    { withCredentials: true } // important for sending cookies
                );
                setUsers(res.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.error || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [classId, assignId]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error)
        return (
            <div className="text-center mt-10 text-red-500 font-bold">{error}</div>
        );  

    return (
        <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded">
            <h1 className="text-xl font-bold mb-4 text-center">
                Assignment Submissions
            </h1>
            <ul>
                {users.map((user, index) => (
                    <li
                        key={index}
                        className="flex justify-between p-2 border-b last:border-none"
                    >
                        <span>{user.name}</span>
                        <span className="text-gray-500 text-sm">
                            {new Date(user.lastSubmitted).toLocaleString()}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AssignmentUsers;
