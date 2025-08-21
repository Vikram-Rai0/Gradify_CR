import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, CheckCircle, Upload, MessageSquare, Trash2, AlertCircle, FileText, RefreshCw } from "lucide-react";

const GetSinglePageAssignment = ({ showSubmission = true }) => {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [unsubmitting, setUnsubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);

  const { classId, assignId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userRes = await axios.get("http://localhost:5000/api/user/me", { withCredentials: true });
        setUser(userRes.data);

        const assignRes = await axios.get(
          `http://localhost:5000/api/classwork/${classId}/getAssignment/${assignId}`,
          { withCredentials: true }
        );
        setAssignment(assignRes.data);

        // fetch student submission if student
        if (userRes.data.role === "Student") {
          const subRes = await axios.get(
            `http://localhost:5000/api/classwork/${classId}/assignment/${assignId}/getmySubmission`,
            { withCredentials: true }
          );
          setSubmissionData(subRes.data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load assignment.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId, assignId]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmitAssignment = async () => {
    if (!file) return alert("Please attach a file before submitting.");

    setSubmitting(true);
    const formData = new FormData();
    formData.append("attachments", file);
    formData.append("comment", comment);

    try {
      await axios.post(
        `http://localhost:5000/api/classwork/${classId}/submitAssignment/${assignId}`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccess("Assignment submitted successfully!");
      setFile(null);
      setComment("");

      // Refresh submission data
      const subRes = await axios.get(
        `http://localhost:5000/api/classwork/${classId}/assignment/${assignId}/getmySubmission`,
        { withCredentials: true }
      );
      setSubmissionData(subRes.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnsubmitAssignment = async () => {
    if (!window.confirm("Are you sure you want to unsubmit this assignment?")) return;

    setUnsubmitting(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/classwork/${classId}/unsubmitAssignment/${assignId}`,
        { withCredentials: true }
      );
      setSuccess("Assignment unsubmitted successfully!");
      setSubmissionData({ submission: null, feedback: [], canResubmit: false });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to unsubmit assignment.");
    } finally {
      setUnsubmitting(false);
    }
  };

  const handleResubmit = () => {
    setSubmissionData({ submission: null, feedback: submissionData.feedback, canResubmit: true });
    setFile(null);
    setComment("");
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "accept":
        return {
          text: "Accepted",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: CheckCircle
        };
      case "resubmit":
        return {
          text: "Resubmission Required",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: RefreshCw
        };
      case "pending":
      default:
        return {
          text: "Pending Review",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          icon: Clock
        };
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!assignment) return <p className="text-center mt-10 text-gray-400">No assignment found!</p>;

  const submission = submissionData?.submission;
  const feedback = submissionData?.feedback || [];
  const canResubmit = submissionData?.canResubmit;

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start mt-10 px-4 gap-6 max-w-7xl mx-auto">
      <div className="bg-white shadow-lg rounded-2xl w-full lg:w-2/3 p-5 border border-gray-100">
        <div className="flex items-start justify-between border-b pb-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
            <p className="text-gray-600">{assignment.description}</p>
          </div>
          <span className="text-red-600 px-4 py-1.5 rounded-full text-sm font-semibold">
            Due: {new Date(assignment.due_date).toLocaleDateString()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-gray-500 text-sm">Points</p>
              <p className="font-semibold text-gray-800">{assignment.points}</p>
            </div>
          </div>

          {user?.role === "Instructor" && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-gray-500 text-sm">Allow Late Submission</p>
                <p className={`font-semibold ${assignment.allow_late ? "text-green-600" : "text-red-600"}`}>
                  {assignment.allow_late ? "Yes" : "No"}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <Calendar className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-gray-500 text-sm">Created At</p>
              <p className="font-semibold text-gray-800">
                {new Date(assignment.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Section */}
      {showSubmission && user?.role === "Student" && (
        <div className="bg-white shadow-lg rounded-xl w-full lg:w-1/3 p-4 border border-gray-100 flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-gray-800">
            {submission ? "Your Submission" : "Submit Your Work"}
          </h2>

          {submission ? (
            // Show existing submission
            <div className="space-y-4">
              {/* Status Display */}
              {(() => {
                const statusInfo = getStatusInfo(submission.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <div className={`p-3 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                      <span className={`font-semibold text-sm ${statusInfo.color}`}>
                        Status: {statusInfo.text}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Submitted on {new Date(submission.submitted_at).toLocaleString()}
                      {submission.attempt_no > 1 && ` (Attempt ${submission.attempt_no})`}
                    </p>
                  </div>
                );
              })()}

              {/* Feedback History */}
              {feedback.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-800">Feedback History</h3>
                  {feedback.map((fb, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-600">From: {fb.instructor_name}</span>
                        <span className="text-xs text-gray-600">{new Date(fb.created_at).toLocaleDateString()}</span>
                      </div>
                      {fb.feedback && (
                        <p className="text-blue-900 text-sm mb-2">{fb.feedback}</p>
                      )}
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        fb.status === 'accept' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {fb.status === 'accept' ? 'Accepted' : 'Resubmission Required'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Grade Display */}
              {submission.grade && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Grade: {submission.grade} / {assignment.points}</span>
                  </div>
                </div>
              )}

              {/* File and Comment */}
              <div className="space-y-3">
                {submission.file_url && (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <a
                      href={`http://localhost:5000${submission.file_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm hover:underline font-medium"
                    >
                      View Submitted File
                    </a>
                  </div>
                )}
                {submission.content && (
                  <div className="p-3 bg-gray-50 rounded-lg max-h-20 overflow-auto">
                    <p className="text-sm text-gray-600 mb-1">Your comment:</p>
                    <p className="text-gray-800 text-sm break-words">{submission.content}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-3">
                {canResubmit || submission.status === "resubmit" ? (
                  // Show resubmit option
                  <button
                    onClick={handleResubmit}
                    className="flex-1 px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition font-medium flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Resubmit Assignment
                  </button>
                ) : submission.status === "pending" ? (
                  // Show unsubmit option for pending submissions
                  <button
                    onClick={handleUnsubmitAssignment}
                    disabled={unsubmitting}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition font-medium disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    {unsubmitting ? "Unsubmitting..." : "Unsubmit"}
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            // Show submission form (for new submissions or resubmissions)
            <>
              {canResubmit && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="font-semibold text-yellow-800 text-sm">Resubmission Required</span>
                  </div>
                  <p className="text-yellow-900 text-xs">
                    Please review the instructor feedback above and submit your revised work.
                  </p>
                </div>
              )}

              {/* File Upload */}
              <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <Upload className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700 text-sm">{file ? file.name : "Attach File"}</span>
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>

              {/* Comment */}
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-gray-400 mt-2" />
                <textarea
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Add a private comment for the teacher..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              {success && (
                <p className="text-green-500 text-center text-sm">{success}</p>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitAssignment}
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-medium shadow-md disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : (canResubmit ? "Resubmit" : "Submit Assignment")}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GetSinglePageAssignment;