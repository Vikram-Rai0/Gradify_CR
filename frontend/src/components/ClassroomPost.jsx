import { useRef } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaYoutube,
  FaLink,
  FaUpload,
  FaBullhorn,
  FaStrikethrough,
} from "react-icons/fa";

export default function ClassroomPost({ onNewPost, closeEditor }) {
  const editorRef = useRef(null);

  const handlePost = () => {
    if (!editorRef.current) return;

    const htmlContent = editorRef.current.innerHTML;
    const plainText = editorRef.current.innerText;

    if (plainText.trim() === "") return;

    const newPost = {
      id: Date.now(),
      author: "Code Work",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toLocaleDateString(),
      content: htmlContent,
    };


    if (typeof onNewPost === "function") {
      onNewPost(newPost);
      editorRef.current.innerHTML = "";
      closeEditor();
    } else {
      console.error("onNewPost is NOT a function!", onNewPost);
    }
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
  };

  return (
    <div className="p-4 bg-white rounded shadow w-full max-w-3xl mx-auto mb-4">
      <div className="flex items-center gap-2 mb-4">
        <select className="border p-2 rounded">
          <option>JS class</option>
        </select>
        <button className="text-blue-600 underline">All students</button>
      </div>

      <div className="flex gap-2 text-gray-600 mb-2">
        <button onClick={() => formatText("bold")} className="border p-1 h-7 rounded hover:bg-gray-200"><FaBold /></button>
        <button onClick={() => formatText("italic")} className="border p-1 h-7 rounded hover:bg-gray-200"><FaItalic /></button>
        <button onClick={() => formatText("underline")} className="border p-1 h-7 rounded hover:bg-gray-200"><FaUnderline /></button>
        <button onClick={() => formatText("insertUnorderedList")} className="border p-1 h-7 rounded hover:bg-gray-200"><FaListUl /></button>
        <button onClick={() => formatText("strikeThrough")} className="border p-1 h-7 rounded hover:bg-gray-200"><FaStrikethrough /></button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="w-full border rounded p-3 mb-4 min-h-[160px] border-gray-300 focus:outline-none"
        placeholder="Announce something to your class"
      ></div>

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
          <button
            onClick={closeEditor}
            className="text-red-600 border border-red-500 px-4 py-1 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handlePost}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
