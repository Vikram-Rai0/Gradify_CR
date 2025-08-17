import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
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

                console.log(res.data);
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
            {assignments.length === 0 ? (
                <p>No assignments found.</p>
            ) : (
                <ul className=" w-full  flex  flex-col justify-center items-baseline-last ">
                    {assignments.map((a) => (
                        <Link to={`/classroom/${classId}/assignment/${a.assign_id}`}>
                            <li key={a.assignment_id} className="border border-[#456882] p-4 mb-3 w-200 flex items-center gap-2 rounded-md shadow-md bg-gradient-to-r from-[#224a66] to-[#507896] hover:from-[#456882] hover:to-[#1B3C53]">
                                < MdOutlineAssignment className="text-4xl text-[#009689]" />
                                <div className="flex flex-col">
                                    <p className="font-semibold text-white flex items-center">
                                        {a.name} posted a new assignment:  {a.title}
                                    </p>

                                    <p className="text-sm text-gray-300">
                                        Posted on: {new Date(a.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        </Link>
                    ))}

                </ul>
            )}
        </div>
    );
};

export default GetAssignment;
