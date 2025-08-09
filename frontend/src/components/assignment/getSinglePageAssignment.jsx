import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const GetSinglePageAssignment = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { classId, assignmentId } = useParams();

    useEffect(() => {
        if (!classId) return; // Don't fetch if no class selected

        setLoading(true);
        axios.get(`http://localhost:5000/api/classwork/${classId}/getAssignment/${assignmentId}`, {

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

    }, [assignmentId, classId]);

    if (loading) return <p>Loading assignments...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Assignments</h2>
            {assignments.length === 0 ? (
                <p>No assignments found.</p>
            ) : (
                <ul>
                    {assignments.map((a) => (
                        <li key={a.assignment_id} className="border p-4 mb-3 rounded shadow-sm">


                            <p dangerouslySetInnerHTML={{ __html: a.description }}></p>
                            <p>
                                {a.name}  <strong>posted a new assignment</strong>  <h3 className="font-bold text-lg">{a.title}</h3>
                                <strong>Due:</strong> {new Date(a.due_date).toLocaleString()}
                            </p>
                            <p>
                                <strong>Grading:</strong> {a.grading_type} |{" "}
                                <strong>Allow late:</strong> {a.allow_late ? "Yes" : "No"}
                            </p>
                            <p className="text-sm text-gray-500">
                                Posted on: {new Date(a.created_at).toLocaleString()}
                            </p>
                        </li>
                    ))}

                </ul>
            )}
        </div>
    );
};

export default GetSinglePageAssignment;
