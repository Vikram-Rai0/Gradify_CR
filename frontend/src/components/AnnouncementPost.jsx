import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import axios from "axios";
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

const AnnouncementPost = forwardRef(
  (
    { onNewPost, closeEditor, editorOnly = false, hideFooterButtons = false },
    ref
  ) => {
    const editorRef = useRef(null);
    const [selectedClassId, setSelectedClassId] = useState(""); // Class dropdown state

    // Expose getContent to parent
    useImperativeHandle(ref, () => ({
      getContent: () => editorRef.current?.innerHTML || "",
    }));

    // Text formatting
    const formatText = (command) => {
      document.execCommand(command, false, null);
      editorRef.current?.focus();
    };

    // Handle post submission
    const handlePost = async () => {
      const htmlContent = editorRef.current?.innerHTML;
      const plainText = editorRef.current?.innerText;

      // Validate input
      if (!plainText.trim() || !selectedClassId) {
        alert("Please select a class and write a message.");
        return;
      }

      const postData = {
        class_id: selectedClassId,
        posted_by: "user123", // TODO: Replace with actual user ID
        message: htmlContent,
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/api/announcements",
          postData
        );

        if (response.status === 201 || response.status === 200) {
          // Optional: response.data.insertId if returned
          onNewPost?.({
            ...postData,
            id: response.data.insertId || Date.now(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });

          // Reset editor
          editorRef.current.innerHTML = "";
          setSelectedClassId("");
          closeEditor?.();
        } else {
          console.error("Failed to post announcement:", response.statusText);
        }
      } catch (error) {
        console.error("Error posting announcement:", error);
      }
    };

    return (
      <div className="p-4 bg-white rounded shadow w-full max-w-3xl mx-auto mb-4">
        {/* Header: Class Selector + Audience */}
        <div className="flex items-center gap-2 mb-4">
          <select
            className="border p-2 rounded"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <option value="">Select class</option>
            <option value="1">JS class</option>
            <option value="2">React class</option>
          </select>
          <button className="text-blue-600 underline">All students</button>
        </div>

        {/* Toolbar */}
        <div className="flex gap-2 text-gray-600 mb-2">
          <button
            onClick={() => formatText("bold")}
            className="border p-1 h-7 rounded hover:bg-gray-200"
          >
            <FaBold />
          </button>
          <button
            onClick={() => formatText("italic")}
            className="border p-1 h-7 rounded hover:bg-gray-200"
          >
            <FaItalic />
          </button>
          <button
            onClick={() => formatText("underline")}
            className="border p-1 h-7 rounded hover:bg-gray-200"
          >
            <FaUnderline />
          </button>
          <button
            onClick={() => formatText("insertUnorderedList")}
            className="border p-1 h-7 rounded hover:bg-gray-200"
          >
            <FaListUl />
          </button>
          <button
            onClick={() => formatText("strikeThrough")}
            className="border p-1 h-7 rounded hover:bg-gray-200"
          >
            <FaStrikethrough />
          </button>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          className="w-full border rounded p-3 mb-4 min-h-[160px] border-gray-300 focus:outline-none"
          placeholder="Announce something to your class"
        ></div>

        {/* Footer */}
        {!editorOnly && (
          <div className="flex justify-between items-center">
            {/* Left: Optional tools */}
            <div className="flex gap-4 text-gray-600">
              <button>
                <FaBullhorn />
              </button>
              <button>
                <FaYoutube />
              </button>
              <label className="cursor-pointer flex items-center gap-1">
                <input type="file" className="hidden" />
                <FaUpload />
              </label>
              <button>
                <FaLink />
              </button>
            </div>

            {/* Right: Post / Cancel */}
            {!hideFooterButtons && (
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
            )}
          </div>
        )}
      </div>
    );
  }
);

export default AnnouncementPost;
