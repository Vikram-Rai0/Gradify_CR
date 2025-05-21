import { useState } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaYoutube,
  FaLink,
  FaUpload,
  FaBullhorn,
} from "react-icons/fa";

export default function ClassroomPost() {
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);

  const handlePost = () => {
    if (message.trim() === "") return;

    const newPost = {
      id: Date.now(),
      author: "code Work",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: message,
    };

    setPosts([newPost, ...posts]);
    setMessage("");
  };

  const handleCancel = () => {
    setMessage("");
  };

  return (
    <div className="p-4 bg-white rounded shadow-md w-full max-w-3xl mx-auto">
      {/* Dropdown + Student Selection */}
      <div className="flex items-center gap-2 mb-4">
        <select className="border p-2 rounded">
          <option>JS class</option>
        </select>
        <button className="text-blue-600 underline">All students</button>
      </div>

      {/* Textarea */}
      <textarea
        className="w-full border rounded p-3 mb-2 resize-none"
        rows="4"
        placeholder="Announce something to your class"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* Toolbar */}
      <div className="flex gap-4 text-gray-600 mb-4">
        <button><FaBold /></button>
        <button><FaItalic /></button>
        <button><FaUnderline /></button>
        <button><FaListUl /></button>
        <button className="line-through">T</button>
      </div>

      {/* Bottom row */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 text-gray-600">
          <button><FaBullhorn /></button>
          <button><FaYoutube /></button>
          <label className="cursor-pointer flex items-center gap-1">
            <input type="file" className="hidden" />
            <FaUpload />
          </label>
          <button><FaLink /></button>
        </div>
        <div className="flex gap-2">
          <button onClick={handleCancel} className="text-red-600 border px-4 py-1 rounded">
            Cancel
          </button>
          <button
            onClick={handlePost}
            className={`bg-blue-600 text-white px-4 py-2 rounded ${!message.trim() ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={!message.trim()}
          >
            Post
          </button>
        </div>
      </div>

      {/* Posts Stream */}
      {posts.length > 0 && (
        <div className="mt-6 space-y-4 border-t pt-4">
          {posts.map((post) => (
            <div key={post.id} className="border-b pb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-pink-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{post.author}</div>
                  <div className="text-sm text-gray-500">{post.time}</div>
                </div>
              </div>
              <div className="text-gray-800 ml-10">{post.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
