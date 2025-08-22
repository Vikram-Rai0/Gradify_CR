import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import ClassroomPost from "../components/annnouncement/Announcement";
import GetAnnouncement from "../components/annnouncement/GetAnnouncement";
import GetAssignment from "../components/assignment/GetAssignment";
import { MdOutlineAssignment } from "react-icons/md";

const Stream = () => {
  const { classId } = useParams();
  const [isOpenAnnouncement, setIsOpenAnnouncement] = useState(false);
  const [reload, setReload] = useState(false);
  const [classes, setClasses] = useState(null);
  const [user, setUser] = useState(null);
  
  // States to collect data from child components
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [feedItems, setFeedItems] = useState([]);

  const openAnnouncement = () => setIsOpenAnnouncement(true);
  const closeAnnouncement = () => setIsOpenAnnouncement(false);

  const handleNewPost = () => {
    setReload((prev) => !prev);
    closeAnnouncement();
  };

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/me", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

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

  // Combine and sort announcements and assignments whenever they change
  useEffect(() => {
    const combinedItems = [];

    // Process announcements
    announcements.forEach(announcement => {
      combinedItems.push({
        type: 'announcement',
        id: announcement.announcement_id,
        created_at: announcement.created_at,
        data: announcement
      });
    });

    // Process assignments
    assignments.forEach(assignment => {
      combinedItems.push({
        type: 'assignment',
        id: assignment.assign_id,
        created_at: assignment.created_at,
        data: assignment
      });
    });

    // Sort by created_at (newest first)
    combinedItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    setFeedItems(combinedItems);
  }, [announcements, assignments]);

  // Render individual feed item
  const renderFeedItem = (item) => {
    if (item.type === 'announcement') {
      const announcement = item.data;
      return (
        <div key={`announcement-${item.id}`} className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
            A
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 w-full hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-semibold text-gray-800">
                Announcement
              </h4>
              <span className="text-xs text-gray-400">
                {new Date(announcement.created_at).toLocaleString()}
              </span>
            </div>
            <div 
              className="text-sm text-gray-600 mt-2"
              dangerouslySetInnerHTML={{ __html: announcement.message }}
            />
          </div>
        </div>
      );
    } else if (item.type === 'assignment') {
      const assignment = item.data;
      const linkPath = user?.role === "Instructor"
        ? `/classroom/${classId}/assignment/${assignment.assign_id}/studentWork`
        : `/classroom/${classId}/assignment/${assignment.assign_id}`;

      return (
        <Link key={`assignment-${item.id}`} to={linkPath} className="block">
          <div className="flex items-start space-x-3 justify-end hover:bg-gray-50 rounded-xl p-2 transition">
            <div className="bg-blue-50 rounded-xl shadow-sm p-4 w-full max-w-[75%] hover:shadow-md transition border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <MdOutlineAssignment className="text-xl text-blue-500" />
                <h4 className="text-sm font-semibold text-gray-800">
                  {assignment.name} posted a new assignment
                </h4>
              </div>
              <div className="flex justify-between items-start mb-2">
                <h5 className="text-base font-semibold text-gray-900">
                  {assignment.title}
                </h5>
                <span className="text-xs text-gray-400">
                  {new Date(assignment.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                {assignment.points && <span>{assignment.points} points</span>}
              </div>
            </div>
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              T
            </div>
          </div>
        </Link>
      );
    }
  };

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

          {/* Hidden components to fetch data */}
          <div style={{ display: 'none' }}>
            <GetAnnouncement
              classId={classId}
              reload={reload}
              onDataFetched={setAnnouncements}
            />
              <GetAssignment
                classId={classId}
                onDataFetched={setAssignments}
              />
          </div>

          {/* Unified Feed Display */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {feedItems.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No posts yet. Create your first announcement to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {feedItems.map(renderFeedItem)}
              </div>
            )}
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