import React, { useState } from 'react';
import ClassroomPost from '../components/ClassroomPost';

const Stream = () => {
  const [isOpenAnnouncement, setIsOpenAnnouncement] = useState(false);
  const [posts, setPosts] = useState([]);

  const openAnnouncement = () => {
    setIsOpenAnnouncement(true);
  };

  const closeAnnouncement = () => {
    setIsOpenAnnouncement(false);
  };

  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div className='flex flex-col justify-center items-center '>
      <div className='flex justify-between items-center mt-10 w-267 relative'>
        <div className='border-2 rounded-xl border-gray-500 h-50 w-45'>
          <h1>Upcoming</h1>
        </div>
        <div className='border-2 rounded-xl border-blue-300 h-55 w-170'>
          <h1></h1>
        </div>
        <div className='h-55 pt-1'>
          <div className='border-2 rounded-xl border-gray-500 h-25 w-45'>
            <h1>Class Code</h1>
          </div>
        </div>
      </div>

      <div className='gap-4 w-full h-full flex flex-col items-center '>
        {!isOpenAnnouncement && (
          <button onClick={openAnnouncement}>
            <div className="attachemnt border-1 border-green-500 rounded-xl h-19 w-190 mt-2">
              <h1>Click here for announcement</h1>
            </div>
          </button>
        )}

        {isOpenAnnouncement && (
          <div className="w-full flex justify-center">
            <ClassroomPost
              closeEditor={closeAnnouncement}     // ✅ renamed prop correctly
              onNewPost={handleNewPost}           // ✅ this is the key fix
            />
          </div>
        )}
        <div className='w-full '>

          <div className="announcement gap-2 w-full flex flex-col justify-start m-3 pl-55">
            {posts.map((post) => (
              <div key={post.id} className="border-2 border-[#508C9B] w-180 p-3 rounded-lg shadow bg-white ">
                <div className="text-sm text-gray-500 mb-2">
                  <strong>{post.author}</strong> • {post.date}, <br />
                  {post.time}
                </div>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            ))}
          </div>
          <div className="assignement gap-2 felx flex-col justify-items-end m-3 pr-55" >
            <div className="postAssignment border-2 border-[#93BFCF] h-40 w-180 flex items-end justify-center p-1 rounded-lg">
              <div className="addcomment border-t-1 h-15 w-full "></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stream;
