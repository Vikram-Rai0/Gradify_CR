import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import ClassroomPost from '../components/AnnouncementPost';
import { useParams } from 'react-router-dom';

const Stream = () => {
  const { classId } = useParams();

  const [isOpenAnnouncement, setIsOpenAnnouncement] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const openAnnouncement = () => setIsOpenAnnouncement(true);
  const closeAnnouncement = () => setIsOpenAnnouncement(false);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/announcement/announcements/${classId}`,
        {
          withCredentials: true, // JWT cookie required
        }
      );

      const formatted = res.data.map((a) => {
        const date = new Date(a.created_at);
        return {
          id: a.announcement_id,
          author: a.posted_by,
          date: date.toLocaleDateString(),
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: a.message,
        };
      });

      setPosts(formatted);
    } catch (err) {
      console.error('Error loading announcements:', err);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    if (classId) {
      fetchAnnouncements();
    }
  }, [classId, fetchAnnouncements]);

  const handleNewPost = () => {
    fetchAnnouncements();
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
    <div className="flex flex-col justify-center items-center">
      {/* Header Section */}
      <div className="flex justify-between items-center mt-10 w-full max-w-[1000px] px-4">
        <div className="border-2 rounded-xl border-gray-500 h-[80px] w-[150px] flex flex-col justify-center items-center">
          <h1 className="text-md font-medium">Upcoming</h1>
        </div>
        <div className="border-2 rounded-xl border-blue-300 h-[90px] w-[500px] flex flex-col justify-center items-center">
          <h1 className="text-xl font-semibold">Announcements</h1>
        </div>
        <div className="h-[90px] pt-1">
          <div className="border-2 rounded-xl border-gray-500 h-[60px] w-[150px] flex flex-col justify-center items-center">
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

        {/* New Announcement Form */}
        {isOpenAnnouncement && (
          <div className="w-full flex justify-center">
            <ClassroomPost
              closeEditor={closeAnnouncement}
              onNewPost={handleNewPost}
              classId={classId}
            />
          </div>
        )}

        {/* Announcements & Assignments */}
        <div className="w-full flex flex-col md:flex-row mt-4 max-w-[1100px]">
          {/* Announcements */}
          <div className="announcement gap-4 w-full flex flex-col justify-start m-3">
            {loading ? (
              <p>Loading announcements...</p>
            ) : posts.length === 0 ? (
              <p>No announcements yet.</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="border-2 border-[#508C9B] p-4 rounded-lg shadow bg-white w-full"
                >
                  <div className="text-sm text-gray-500 mb-2">
                    <strong>{post.author}</strong> • {post.date}, {post.time}
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(post.content),
                    }}
                  />
                </div>
              ))
            )}
          </div>

          {/* Assignments Placeholder */}
          <div className="assignment gap-2 flex flex-col justify-items-end m-3 w-full md:w-[300px]">
            <div className="postAssignment border-2 border-[#93BFCF] h-[160px] w-full flex items-end justify-center p-2 rounded-lg">
              <div className="addcomment border-t w-full h-[60px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stream;
