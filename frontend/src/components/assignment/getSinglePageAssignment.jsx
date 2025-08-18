import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, CheckCircle, Upload, MessageSquare } from "lucide-react";

const GetSinglePageAssignment = () => {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

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
      alert("Assignment submitted successfully!");
      setFile(null);
      setComment("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!assignment) return <p className="text-center mt-10 text-gray-400">No assignment found!</p>;

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start mt-10 px-4 gap-6 max-w-7xl mx-auto">
      {/* Assignment Info */}
      <div className="bg-white shadow-lg rounded-2xl w-full lg:w-2/3 p-6 border border-gray-100">
        <div className="flex items-start justify-between border-b pb-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
            <p className="text-gray-600">{assignment.description}</p>
          </div>
          <span className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-sm font-semibold">
            Due {new Date(assignment.due_date).toLocaleDateString()}
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
      <div className="bg-white shadow-lg rounded-2xl w-full lg:w-1/3 p-6 border border-gray-100 flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-gray-800">Submit Your Work</h2>

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

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-2">
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
            {submitting ? "Submitting..." : "Submit Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetSinglePageAssignment;
