import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ClassroomPost from '../components/annnouncement/Announcement';
import GetAnnouncement from '../components/annnouncement/GetAnnouncement';
import GetAssignment from '../components/assignment/GetAssignment';

const Stream = () => {
  const { classId } = useParams();
  const [isOpenAnnouncement, setIsOpenAnnouncement] = useState(false);
  const [reload, setReload] = useState(false); // 🔁 trigger for reloading announcements

  const openAnnouncement = () => setIsOpenAnnouncement(true);
  const closeAnnouncement = () => setIsOpenAnnouncement(false);

  const handleNewPost = () => {
    setReload((prev) => !prev); // 🔁 trigger GetAnnouncements re-fetch
    closeAnnouncement();
  };

  if (!classId) {
    return (
      <div className="text-red-500 mt-10 text-lg font-semibold">
        Class ID not found in URL. Please join or navigate to a valid class.
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between items-center p-2">
      {/* Header Section */}
      <div className="flex justify-between items-center mt-3 w-full max-w-300 gap-2 ">
        <div className="border-2 rounded-xl border-gray-500 h-[150px] w-[200px] flex flex-col justify-center items-center">
          <h1 className="text-md font-medium">Upcoming</h1>
        </div>
        <div className="border-2 rounded-xl border-gray-200 bg-[#456882] h-[250px] w-full flex flex-col justify-center items-center">
          <h1 className="text-xl font-semibold">Announcements</h1>
        </div>
        <div className="h-[90px] pt-1">
          <div className="border-2 rounded-xl border-gray-500 h-[90px] w-[150px] flex flex-col justify-center items-center">
            <h1 className="text-md font-medium">Class Code</h1>
            <p className="text-sm text-blue-600">{classId}</p>
          </div>
        </div>
      </div>

      {/* Post Announcement Button */}
      <div className="gap-4 w-full h-full flex flex-col items-center mt-4">
        {!isOpenAnnouncement && (
          <button onClick={openAnnouncement}>
            <div className="border border-green-500 rounded-xl h-[70px] w-[300px] mt-2 flex items-center justify-center hover:bg-green-50">
              <h1 className="text-base font-medium">Click here for announcement</h1>
            </div>
          </button>
        )}

        {isOpenAnnouncement && (
          <div className="w-full flex justify-center">
            <ClassroomPost
              closeEditor={closeAnnouncement}
              onNewPost={handleNewPost}
              classId={classId}
            />
          </div>
        )}
      </div>

      {/* Get announcements (independent component) */}
      <GetAnnouncement classId={classId} reload={reload} />
      <GetAssignment classId={classId} />
    </div>
  );
};

export default Stream;
