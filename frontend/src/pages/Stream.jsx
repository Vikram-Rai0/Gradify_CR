import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ClassroomPost from "../components/annnouncement/Announcement";
import GetAnnouncement from "../components/annnouncement/GetAnnouncement";
import GetAssignment from "../components/assignment/GetAssignment";

const Stream = () => {
  const { classId } = useParams();
  const [isOpenAnnouncement, setIsOpenAnnouncement] = useState(false);
  const [reload, setReload] = useState(false);
  const [classes, setClasses] = useState(null);

  const openAnnouncement = () => setIsOpenAnnouncement(true);
  const closeAnnouncement = () => setIsOpenAnnouncement(false);

  const handleNewPost = () => {
    setReload((prev) => !prev);
    closeAnnouncement();
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/classroom/getclassroom", {
          withCredentials: true,
        });
        const currentClass = res.data.find(
          (cls) => String(cls.class_id) === String(classId)
        );
        setClasses(currentClass || null);
      } catch (err) {
        console.error("Error fetching classroom:", err.response?.data || err.message);
      }
    };

    fetchClasses();
  }, [classId]);

  if (!classId) {
    return (
      <div className="text-center text-red-500 mt-10 text-lg font-semibold">
        Class ID not found in URL. Please join or navigate to a valid class.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">


      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Class Stream</h1>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </span>
        </header>
        <main className="flex-1 p-6 flex flex-col bg-gray-50">
          {/* New Announcement */}
          <div className="mb-4">
            {!isOpenAnnouncement ? (
              <button
                onClick={openAnnouncement}
                className="w-full bg-[#01a799] hover:bg-[#049685] text-white rounded-lg px-4 py-3 shadow transition font-medium"
              >
                + New Announcement
              </button>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <ClassroomPost
                  closeEditor={closeAnnouncement}
                  onNewPost={handleNewPost}
                  classId={classId}
                />
              </div>
            )}
          </div>

          {/* Chat-like Feed */}
          <div className="flex-1 overflow-y-auto space-y-4">

            {/* Announcements */}
            <GetAnnouncement
              classId={classId}
              reload={reload}
              renderItem={(announcement) => (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
                    A
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-4 w-full hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-gray-800">
                        {announcement.title || "Announcement"}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {new Date(announcement.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{announcement.content}</p>
                  </div>
                </div>
              )}
            />

            {/* Assignments */}
            <GetAssignment
              classId={classId}
              renderItem={(assignment) => (
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-blue-50 rounded-xl shadow-sm p-4 w-full max-w-[75%] hover:shadow-md transition border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-gray-800">
                        {assignment.title}
                      </h4>
                      <span className="text-xs text-gray-400">
                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{assignment.description}</p>
                  </div>
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    T
                  </div>
                </div>
              )}
            />

          </div>
        </main>




      </div>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {classes?.class_name || "Classroom"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Instructor: {classes?.created_by || "Unknown"}
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700">Class Code</h3>
            <p className="font-mono text-blue-600 text-lg mt-1">
              {classes?.invite_code || "N/A"}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700">Upcoming</h3>
            <p className="text-sm text-gray-500 mt-2">No upcoming work</p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Stream;
