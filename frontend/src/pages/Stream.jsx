import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClassroomPost from '../components/AnnouncementPost';

const Stream = () => {
  const [isOpenAnnouncement, setIsOpenAnnouncement] = useState(false);
  const [posts, setPosts] = useState([]);
  const classId = localStorage.getItem('class_id');

  const openAnnouncement = () => {
    setIsOpenAnnouncement(true);
  };

  const closeAnnouncement = () => {
    setIsOpenAnnouncement(false);
  };

  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/announcements');
        const filtered = res.data.filter((a) => a.class_id == classId);
        const formatted = filtered.map((a) => ({
          id: a.announcement_id,
          author: a.posted_by,
          date: new Date(a.created_at).toLocaleDateString(),
          time: new Date(a.created_at).toLocaleTimeString(),
          content: a.message,
        }));
        setPosts(formatted);
      } catch (err) {
        console.error('Error loading announcements:', err);
      }
    };

    if (classId) fetchAnnouncements();
  }, [classId]);

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex justify-between items-center mt-10 w-267 relative'>
        <div className='border-2 rounded-xl border-gray-500 h-50 w-45 flex flex-col justify-center items-center'>
          <h1 className='text-md font-medium'>Upcoming</h1>
        </div>
        <div className='border-2 rounded-xl border-blue-300 h-55 w-170 flex flex-col justify-center items-center'>
          <h1 className='text-xl font-semibold'>Announcements</h1>
        </div>
        <div className='h-55 pt-1'>
          <div className='border-2 rounded-xl border-gray-500 h-25 w-45 flex flex-col justify-center items-center'>
            <h1 className='text-md font-medium'>Class Code</h1>
            <p className='text-sm text-blue-600'>{classId}</p>
          </div>
        </div>
      </div>

      <div className='gap-4 w-full h-full flex flex-col items-center'>
        {!isOpenAnnouncement && (
          <button onClick={openAnnouncement}>
            <div className="attachemnt border-1 border-green-500 rounded-xl h-19 w-190 mt-2 flex items-center justify-center">
              <h1 className="text-base font-medium">Click here for announcement</h1>
            </div>
          </button>
        )}

        {isOpenAnnouncement && (
          <div className="w-full flex justify-center">
            <ClassroomPost
              closeEditor={closeAnnouncement}
              onNewPost={handleNewPost}
            />
          </div>
        )}

        <div className='w-full flex flex-col md:flex-row mt-4'>
          <div className="announcement gap-2 w-full flex flex-col justify-start m-3 pl-55">
            {posts.map((post) => (
              <div key={post.id} className="border-2 border-[#508C9B] w-180 p-3 rounded-lg shadow bg-white">
                <div className="text-sm text-gray-500 mb-2">
                  <strong>{post.author}</strong> • {post.date}, {post.time}
                </div>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            ))}
          </div>

          <div className="assignment gap-2 flex flex-col justify-items-end m-3 pr-55">
            <div className="postAssignment border-2 border-[#93BFCF] h-40 w-180 flex items-end justify-center p-1 rounded-lg">
              <div className="addcomment border-t-1 h-15 w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stream;
