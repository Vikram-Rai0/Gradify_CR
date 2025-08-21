import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Clock, CheckCircle, RefreshCw, FileText, MessageSquare } from "lucide-react";
import GetSinglePageAssignment from "./GetSinglePageAssignment";

const AssignmentUsers = () => {
  const { classId, assignId } = useParams();
  const [studentsData, setStudentsData] = useState({ students: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [grade, setGrade] = useState({});
  const [showFeedback, setShowFeedback] = useState({});
  const [processing, setProcessing] = useState({});
  const feedbackRefs = useRef({});

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/classwork/${classId}/assignment/${assignId}/assignUser`,
        { withCredentials: true }
      );

      setStudentsData(res.data);

      const initialGrade = {};
      const initialFeedback = {};

      res.data.students.forEach((student) => {
        initialGrade[student.student_id] = student.points || "";
        initialFeedback[student.student_id] = student.latest_feedback || "";
      });

      setGrade(initialGrade);
      setFeedback(initialFeedback);
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

      Object.keys(showFeedback).forEach((studentId) => {
        if (
          showFeedback[studentId] &&
          feedbackRefs.current[studentId] &&
          !feedbackRefs.current[studentId].contains(event.target)
        ) {
          updated[studentId] = false;
          changed = true;
        }
      });

      if (changed) setShowFeedback(updated);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFeedback]);

  const handleAction = async (studentId, action) => {
    if (action === "resubmit" && (!feedback[studentId] || feedback[studentId].trim() === "")) {
      alert("Please enter feedback before requesting resubmission.");
      return;
    }

    setProcessing((prev) => ({ ...prev, [studentId]: true }));

    try {
      await axios.post(
        `http://localhost:5000/api/classwork/${classId}/assignment/${assignId}/action`,
        {
          studentId,
          action,
          feedback: feedback[studentId] || "",
          grade: grade[studentId] ? parseFloat(grade[studentId]) : null,
        },
        { withCredentials: true }
      );

      await fetchUsers(); // Refresh data
      setShowFeedback((prev) => ({ ...prev, [studentId]: false }));
    } catch (err) {
      console.error(err);
      alert("Action failed: " + (err.response?.data?.message || "Try again"));
    } finally {
      setProcessing((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "accept":
        return "Accepted";
      case "resubmit":
        return "Resubmit Required";
      case "pending":
        return "Pending Review";
      case "not_submitted":
        return "Not Submitted";
      default:
        return "Not Submitted";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accept":
        return "text-green-600 bg-green-50";
      case "resubmit":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "not_submitted":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accept":
        return <CheckCircle className="w-4 h-4" />;
      case "resubmit":
        return <RefreshCw className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading)
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;

  if (error)
    return <div className="flex justify-center items-center h-screen text-red-500 font-bold">{error}</div>;

  const { students, stats } = studentsData;

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen">
      {/* Assignment View */}
      <div className="lg:w-2/3 p-3">
        <GetSinglePageAssignment showSubmission={false} />
      </div>

      {/* Assignment Submissions */}
      <div className="lg:w-1/3 bg-white shadow p-3">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-center text-gray-800 mb-3">Assignment Submissions</h1>

          {/* Stats Display */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div className="bg-blue-50 p-2 rounded text-center">
              <div className="font-semibold text-blue-600">{stats.total || 0}</div>
              <div className="text-gray-600">Total</div>
            </div>
            <div className="bg-yellow-50 p-2 rounded text-center">
              <div className="font-semibold text-yellow-600">{stats.pending || 0}</div>
              <div className="text-gray-600">Pending</div>
            </div>
            <div className="bg-green-50 p-2 rounded text-center">
              <div className="font-semibold text-green-600">{stats.accepted || 0}</div>
              <div className="text-gray-600">Accepted</div>
            </div>
            <div className="bg-red-50 p-2 rounded text-center">
              <div className="font-semibold text-red-600">{stats.resubmit || 0}</div>
              <div className="text-gray-600">Resubmit</div>
            </div>
          </div>
        </div>

        {students.length === 0 ? (
          <p className="text-center text-gray-500">No submissions yet.</p>
        ) : (
          <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
            {students.map((student) => (
              <li
                key={student.student_id}
                className="flex flex-col p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{student.student_name}</p>
                    <p className="text-gray-500 text-xs">{student.student_email}</p>
                    {student.lastSubmitted && (
                      <p className="text-gray-500 text-xs">
                        {student.attempt_no > 1 && `Attempt ${student.attempt_no} - `}
                        {new Date(student.lastSubmitted).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        student.submission_status
                      )}`}
                    >
                      {getStatusIcon(student.submission_status)}
                      {getStatusDisplay(student.submission_status)}
                    </div>
                    {student.points && (
                      <div className="text-xs font-medium mt-1 text-gray-600">{student.points} pts</div>
                    )}
                  </div>
                </div>

                {/* Show existing feedback if any */}
                {student.latest_feedback && !showFeedback[student.student_id] && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-gray-700 border-l-2 border-blue-300">
                    <div className="flex items-center gap-1 mb-1">
                      <MessageSquare className="w-3 h-3" />
                      <strong>Latest feedback:</strong>
                    </div>
                    <p>{student.latest_feedback}</p>
                    {student.feedback_date && (
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(student.feedback_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Only show controls if there's a submission */}
                {student.submission_id && (
                  <>
                    <div className="flex justify-between gap-2 mt-2">
                      {student.submissionFile ? (
                        <a
                          href={`http://localhost:5000${student.submissionFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-xs hover:underline flex-1 text-center rounded border border-gray-200 py-1 flex items-center justify-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          View File
                        </a>
                      ) : (
                        <div className="flex-1 text-center text-xs text-gray-400 py-1">No file</div>
                      )}

                      <input
                        type="number"
                        placeholder="Grade"
                        value={grade[student.student_id] || ""}
                        onChange={(e) =>
                          setGrade((prev) => ({ ...prev, [student.student_id]: e.target.value }))
                        }
                        className="w-[35%] h-7 p-1 border rounded text-sm focus:outline-blue-400"
                      />
                    </div>

                    {/* Feedback Input */}
                    {showFeedback[student.student_id] && (
                      <div
                        className="mt-2"
                        ref={(el) => (feedbackRefs.current[student.student_id] = el)}
                      >
                        <textarea
                          placeholder="Enter feedback..."
                          className="w-full border rounded p-2 text-xs focus:outline-blue-400"
                          value={feedback[student.student_id] || ""}
                          onChange={(e) =>
                            setFeedback((prev) => ({ ...prev, [student.student_id]: e.target.value }))
                          }
                        />
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => handleAction(student.student_id, "resubmit")}
                            disabled={processing[student.student_id]}
                            className="flex-1 py-1 text-sm rounded text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            {processing[student.student_id] ? "Processing..." : "Request Resubmit"}
                          </button>
                          <button
                            onClick={() =>
                              setShowFeedback((prev) => ({ ...prev, [student.student_id]: false }))
                            }
                            className="flex-1 py-1 text-sm rounded text-gray-700 bg-gray-200 hover:bg-gray-300 flex items-center justify-center gap-1"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {!showFeedback[student.student_id] && (
                      <button
                        onClick={() =>
                          setShowFeedback((prev) => ({ ...prev, [student.student_id]: true }))
                        }
                        className="mt-2 w-full py-1 text-sm rounded text-white bg-red-600 hover:bg-red-700 flex items-center justify-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Request Resubmit
                      </button>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AssignmentUsers;
