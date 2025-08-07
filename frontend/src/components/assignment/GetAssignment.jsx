import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MdOutlineAssignment } from "react-icons/md";

const GetAssignment = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { classId } = useParams()
    useEffect(() => {
        if (!classId) return; // Don't fetch if no class selected

        setLoading(true);
        axios
            .get(`http://localhost:5000/api/classwork/${classId}/getAssignment?limit=20`, {
                withCredentials: true,
            })
            .then((res) => {
                setAssignments(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load assignments:", err);
                setError("Failed to load assignments.");
                setLoading(false);
            });

    }, [classId]);

    if (loading) return <p>Loading assignments...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Assignments</h2>
            {assignments.length === 0 ? (
                <p>No assignments found.</p>
            ) : (
                <ul className=" w-250  flex  flex-col justify-center items-baseline-last ">
                    {assignments.map((a) => (

                        <li key={a.assignment_id} className="border border-[#456882] p-4 mb-3 w-200 flex items-center gap-2 rounded shadow-md  ">
                            < MdOutlineAssignment className="text-4xl text-[#16423C]" />
                            <div className="flex flex-col">
                                <p className="font-semibold text-gray-600 flex items-center">
                                    {a.name} posted a new assignment:  {a.title}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Posted on: {new Date(a.created_at).toLocaleString()}                                                    
                                </p>
                            </div>
                        </li>
                    ))}
                
                </ul>
            )}
        </div>
    );
};

export default GetAssignment;
