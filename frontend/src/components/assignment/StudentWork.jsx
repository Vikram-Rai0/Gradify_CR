import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import GetSinglePageAssignment from "./GetSinglePageAssignment";

const AssignmentUsers = () => {
    const { classId, assignId } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedback, setFeedback] = useState({});
    const [points, setPoints] = useState({});
    const [showFeedback, setShowFeedback] = useState({});
    const feedbackRefs = useRef({});

    const fetchUsers = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/classwork/${classId}/assignment/${assignId}/assignUser`,
                { withCredentials: true }
            );
            setUsers(res.data);

            const initialPoints = {};
            res.data.forEach((user) => {
                initialPoints[user.id] = user.points || "";
            });
            setPoints(initialPoints);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [classId, assignId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const updated = { ...showFeedback };
            let changed = false;

            Object.keys(showFeedback).forEach(userId => {
                if (
                    showFeedback[userId] &&
                    feedbackRefs.current[userId] &&
                    !feedbackRefs.current[userId].contains(event.target)
                ) {
                    updated[userId] = false;
                    changed = true;
                }
            });

            if (changed) setShowFeedback(updated);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showFeedback]);

    const handleAction = async (userId, action) => {
        if (action === "resubmit" && (!feedback[userId] || feedback[userId].trim() === "")) {
            alert("Please enter feedback before requesting resubmission.");
            return;
        }

        try {
            await axios.post(
                `http://localhost:5000/api/classwork/${classId}/assignment/${assignId}/action`,
                {
                    userId,
                    action,
                    feedback: feedback[userId] || "",
                    points: points[userId] || 0,
                },
                { withCredentials: true }
            );
            fetchUsers();
            setFeedback((prev) => ({ ...prev, [userId]: "" }));
            setShowFeedback((prev) => ({ ...prev, [userId]: false }));
        } catch (err) {
            console.error(err);
            alert("Action failed: " + (err.response?.data?.error || "Try again"));
        }
    };

    if (loading)
        return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;

    if (error)
        return <div className="flex justify-center items-center h-screen text-red-500 font-bold">{error}</div>;

    return (
        <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen">
            {/* Assignment View */}
            <div className="lg:w-2/3 p-3">
                <GetSinglePageAssignment showSubmission={false} />
            </div>

            {/* Assignment Submissions */}
            <div className="lg:w-1/3 bg-white shadow p-3">
                <h1 className="text-xl font-semibold mb-4 text-center text-gray-800">Submissions</h1>

                {users.length === 0 ? (
                    <p className="text-center text-gray-500">No submissions yet.</p>
                ) : (
                    <ul className="space-y-4 max-h-[70vh] overflow-y-auto">
                        {users.map((user) => (
                            <li
                                key={user.id}
                                className="flex flex-col p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm">{user.student_name}</p>
                                        <p className="text-gray-500 text-xs">
                                            {new Date(user.lastSubmitted).toLocaleString()}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-xs font-semibold ${user.status === "accepted"
                                            ? "text-green-500"
                                            : user.status === "resubmit"
                                                ? "text-yellow-500"
                                                : "text-gray-400"
                                            }`}
                                    >
                                        {user.status || "Pending"}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-2 mt-1">
                                    <a
                                        href={user.submissionFile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 text-xs hover:underline flex-1 text-center rounded border border-gray-200 py-1"
                                    >
                                        View
                                    </a>
                                    <input
                                        type="number"
                                        placeholder="Points"
                                        value={points[user.id] || ""}
                                        onChange={(e) =>
                                            setPoints((prev) => ({ ...prev, [user.id]: e.target.value }))
                                        }
                                        className="w-[35%] h-7 p-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
                                    />
                                </div>

                                {showFeedback[user.id] && (
                                    <textarea
                                        ref={(el) => (feedbackRefs.current[user.id] = el)}
                                        placeholder="Feedback..."
                                        value={feedback[user.id] || ""}
                                        onChange={(e) =>
                                            setFeedback((prev) => ({ ...prev, [user.id]: e.target.value }))
                                        }
                                        className="w-full p-1 mt-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        rows={2}
                                    />
                                )}

                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => handleAction(user.id, "accept")}
                                        className="flex-1 bg-blue-600 text-white py-1 text-sm rounded hover:bg-blue-700 transition"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (showFeedback[user.id]) {
                                                handleAction(user.id, "resubmit");
                                            } else {
                                                // Open only this user's feedback, close others
                                                setShowFeedback({ [user.id]: true });
                                            }
                                        }}
                                        disabled={showFeedback[user.id] && (!feedback[user.id] || feedback[user.id].trim() === "")}
                                        className={`flex-1 py-1 text-sm rounded text-white transition ${showFeedback[user.id]
                                            ? feedback[user.id]?.trim()
                                                ? "bg-yellow-500 hover:bg-yellow-600"
                                                : "bg-gray-300 cursor-not-allowed"
                                            : "bg-yellow-400 hover:bg-yellow-500"
                                            }`}
                                    >
                                        {showFeedback[user.id] ? "Submit" : "Resubmit"}
                                    </button>


                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AssignmentUsers;