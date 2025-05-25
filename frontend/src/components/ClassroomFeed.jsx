  // import { useState } from "react";
  // import ClassroomPost from "./ClassroomPost";

  // export default function ClassroomFeed() {
  //   const [posts, setPosts] = useState([]);
  //   const [showEditor, setShowEditor] = useState(true);

  //   // ✅ Function to add new post
  //   const handleNewPost = (newPost) => {
  //     setPosts((prevPosts) => [newPost, ...prevPosts]);
  //   };

  //   return (
  //     <div className="bg-gray-100 min-h-screen p-4">
  //       {showEditor && (
  //         <ClassroomPost
  //           onNewPost={handleNewPost}         // ✅ PASSED PROPERLY HERE
  //           closeEditor={() => setShowEditor(false)}
  //         />
  //       )}

  //       {!showEditor && (
  //         <button
  //           onClick={() => setShowEditor(true)}
  //           className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
  //         >
  //           + Announce something to your class
  //         </button>
  //       )}


  //     </div>
  //   );
  // }
