import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { MdOutlineAssignment } from "react-icons/md";

const GetAssignment = ({ classId, renderItem, onDataFetched }) => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const { classId: paramClassId } = useParams();
    const effectiveClassId = classId || paramClassId;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/user/me`, {
                    withCredentials: true,
                });
                console.log(res.data);
                setUser(res.data);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (!effectiveClassId) return; // Don't fetch if no class selected

        const fetchAssignments = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `http://localhost:5000/api/classwork/${effectiveClassId}/getAssignment?limit=20`,
                    {
                        withCredentials: true,
                    }
                );

                console.log(res.data);
                const fetchedAssignments = Array.isArray(res.data) ? res.data : [];
                setAssignments(fetchedAssignments);
                
                // Pass data back to parent component if callback is provided
                if (onDataFetched) {
                    onDataFetched(fetchedAssignments);
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Failed to load assignments:", err);
                setError("Failed to load assignments.");
                setAssignments([]);
                
                // Pass empty array to parent on error
                if (onDataFetched) {
                    onDataFetched([]);
                }
                
                setLoading(false);
            }
        };

        fetchAssignments();
    }, [effectiveClassId, onDataFetched]);

    // If onDataFetched is provided, this component is being used for data only
    if (onDataFetched) {
        return null; // Don't render anything, just fetch data
    }

    // Original rendering logic for when used standalone
    if (loading) return <p>Loading assignments...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {assignments.length === 0 ? (
                <p>No assignments found.</p>
            ) : (
                <ul className="w-full flex flex-col justify-center items-baseline-last">
                    {assignments.map((a) => {
                        // If renderItem prop is provided, use it for custom rendering
                        if (renderItem) {
                            return (
                                <div key={a.assign_id}>
                                    {renderItem(a)}
                                </div>
                            );
                        }

                        // Default rendering
                        const linkPath =
                            user?.role === "Instructor"
                                ? `/classroom/${effectiveClassId}/assignment/${a.assign_id}/studentWork`
                                : `/classroom/${effectiveClassId}/assignment/${a.assign_id}`;
                        
                        return (
                            <Link key={a.assign_id} to={linkPath}>
                                <li className="border border-[#456882] p-4 mb-3 w-200 flex items-center gap-2 rounded-md shadow-md bg-gradient-to-r from-[#224a66] to-[#507896] hover:from-[#456882] hover:to-[#1B3C53]">
                                    <MdOutlineAssignment className="text-4xl text-[#009689]" />
                                    <div className="flex flex-col">
                                        <p className="font-semibold text-white flex items-center">
                                            {a.name} posted a new assignment: {a.title}
                                        </p>
                                        <p className="text-sm text-gray-300">
                                            Posted on: {new Date(a.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </li>
                            </Link>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default GetAssignment;