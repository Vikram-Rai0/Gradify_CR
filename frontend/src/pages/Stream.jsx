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
  const [classes, setClasses] = useState(false);

  const openAnnouncement = () => setIsOpenAnnouncement(true);
  const closeAnnouncement = () => setIsOpenAnnouncement(false);

  const handleNewPost = () => {
    setReload((prev) => !prev);
    closeAnnouncement();
  };


  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/classroom/getclassroom', {
          withCredentials: true,
        });
console.log("Fetched classrooms:", res.data);

        // Find the class that matches the current classId from the URL
        const currentClass = res.data.find((cls) => String(cls.class_id) === String(classId));
        setClasses(currentClass || null);
      } catch (err) {
        console.error("Error fetching classroom:", err.response?.data || err.message);
      }
    };

    fetchClasses();
  }, [classId]);

  if (!classId) {
    return (
      <div className="text-center  text-red-500 mt-10 text-lg font-semibold">
        Class ID not found in URL. Please join or navigate to a valid class.
      </div>
    );
  }
  return (
    <div className="flex  flex-col justify-center items-center px-4 py-6 bg-gray-50 min-h-screen ">
      {/* Header Section */}
      <div className="flex  flex-col justify-center items-center md:grid-cols-3 gap-8 w-full max-w-6x mb-6 ">
        {/* Upcoming */}
        <div className=" rounded-xl gap-4  p-4 flex  items-center justify-center h-40 w-full ">
          <div className="flex flex-col justify-center items-center bg-gray-100 shadow-sm rounded-xl  h-full p-2  ">
            <h1 className="text-lg font-semibold text-gray-800">Upcoming</h1>
            <p className="text-sm text-blue-600  mt-2">No upcoming work</p>
          </div>

          {/* Announcements Banner */}
          <div className="rounded-xl shadow-sm bg-gradient-to-r from-blue-700 to-blue-900 p-6 flex flex-col justify-center items-center text-white w-[55%] h-40">
            <h1 className="text-2xl font-semibold">Announcements</h1>
            <p className="text-sm opacity-90 mt-1">Stay updated with the latest posts</p>
          </div>

          {/* Class Code */}
          <div className="rounded-xl shadow-sm bg-gray-100 p-4 flex flex-col items-center h-20">
            <h1 className="text-lg font-semibold text-gray-800">Class Code</h1>
            <p className="text-blue-600 font-mono mt-1">{classes?.invite_code || "noCode"}</p>
          </div>
        </div>

        {/* Post Announcement */}
        <div className="w-full max-w-2xl mb-6">
          {!isOpenAnnouncement ? (
            <button
              onClick={openAnnouncement}
              className="w-full border border-gray-300  bg-[#01a799] hover:bg-[#04b39e] rounded-xl py-4 flex items-center justify-center shadow-sm hover:shadow-md transition"
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

      </div>
      {/* Announcements + Assignments Container */}
      <div className="w-300 shadow-sm rounded-md flex flex-col justify-center items-center p-2 space-y-6">
        {/* Announcements List */}
        <div className="max-w-4xl w-full space-y-4 rounded-lg p-4 ">
          <GetAnnouncement classId={classId} reload={reload} />
        </div>

        {/* Assignments List */}
        <div className="max-w-4xl  w-full space-y-4  rounded-lg  p-4 ">
          <GetAssignment classId={classId} />
        </div>
      </div>
    </div>
  );
};

export default Stream;
