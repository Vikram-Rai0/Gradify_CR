import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ClassroomPost from "../components/annnouncement/Announcement";
import GetAnnouncement from "../components/annnouncement/GetAnnouncement";
import GetAssignment from "../components/assignment/GetAssignment";

const Stream = () => {
  const { classId } = useParams();
  const [isOpenAnnouncement, setIsOpenAnnouncement] = useState(false);
  const [reload, setReload] = useState(false);

  const openAnnouncement = () => setIsOpenAnnouncement(true);
  const closeAnnouncement = () => setIsOpenAnnouncement(false);

  const handleNewPost = () => {
    setReload((prev) => !prev);
    closeAnnouncement();
  };

  if (!classId) {
    return (
      <div className="text-center text-red-500 mt-10 text-lg font-semibold">
        Class ID not found in URL. Please join or navigate to a valid class.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 py-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-center items-center md:grid-cols-3 gap-4 w-full max-w-6x mb-6">
        {/* Upcoming */}
        <div className="border rounded-xl shadow-sm bg-white p-4 flex flex-col items-center justify-center h-35">
          <h1 className="text-lg font-semibold text-gray-800">Upcoming</h1>
          <p className="text-sm text-gray-500 mt-2">No upcoming work</p>
        </div>

        {/* Announcements Banner */}
        <div className="rounded-xl shadow-sm bg-gradient-to-r from-blue-700 to-blue-900 p-6 flex flex-col justify-center items-center text-white w-[50%] h-40">
          <h1 className="text-2xl font-semibold">Announcements</h1>
          <p className="text-sm opacity-90 mt-1">Stay updated with the latest posts</p>
        </div>

        {/* Class Code */}
        <div className="border rounded-xl shadow-sm bg-white p-4 flex flex-col items-center h-20">
          <h1 className="text-lg font-semibold text-gray-800">Class Code</h1>
          <p className="text-blue-600 font-mono mt-1">{classId}</p>
        </div>
      </div>

      {/* Post Announcement */}
      <div className="w-full max-w-2xl mb-6">
        {!isOpenAnnouncement ? (
          <button
            onClick={openAnnouncement}
            className="w-full border border-gray-300  bg-[#009689] hover:bg-[#00796b] rounded-xl py-4 flex items-center justify-center shadow-sm hover:shadow-md transition"
          >
            <span className="text-base font-medium text-white">
              Click here to post an announcement
            </span>
          </button>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <ClassroomPost
              closeEditor={closeAnnouncement}
              onNewPost={handleNewPost}
              classId={classId}
            />
          </div>
        )}
      </div>

      {/* Announcements List */}
      <div className="w-full max-w-4xl space-y-4">
        <GetAnnouncement classId={classId} reload={reload} />
      </div>

      {/* Assignments List */}
      <div className="w-full max-w-4xl mt-6 space-y-4">
        <GetAssignment classId={classId} />
      </div>
    </div>
  );
};

export default Stream;
