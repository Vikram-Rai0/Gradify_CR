import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
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
    { onNewPost, closeEditor, editorOnly = false, hideFooterButtons = false, currentClassId = null },
    ref
  ) => {
    const editorRef = useRef(null);
    const [selectedClassId, setSelectedClassId] = useState([]);
    const [userId, setUserId] = useState(null);
    const [classList, setClassList] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isEditorVisible, setIsEditorVisible] = useState(true);


    // Fetch user and classes
    useEffect(() => {
      axios
        .get("http://localhost:5000/api/user/me", { withCredentials: true }) // send cookie
        .then((res) => {
          setUserId(res.data.user_id);
          console.log("Current logged-in user ID from cookie:", res.data.user_id);
          if (currentClassId) {
            setSelectedClassId([currentClassId]);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch current user:", err);
        }, [[currentClassId]]);
      axios
        .get("http://localhost:5000/api/classroom/getClassroom")
        .then((res) => setClassList(res.data))
        .catch((err) => console.error("Failed to fetch class list", err));
    }, []);
    // NEW: Toggle class selection
    const toggleClassSelection = (classId) => {
      if (selectedClassId.includes(classId)) {
        setSelectedClassId(selectedClassId.filter(id => id !== classId));
      } else {
        setSelectedClassId([...selectedClassId, classId]);
      }
    };

    // NEW: Toggle select all classes
    const toggleSelectAll = () => {
      if (selectAll) {
        setSelectedClassId([]);
      } else {
        setSelectedClassId(classList.map(cls => cls.class_id));
      }
      setSelectAll(!selectAll);
    };



    // Expose method to parent
    useImperativeHandle(ref, () => ({
      getContent: () => editorRef.current?.innerHTML || "",
    }));

    const formatText = (command) => {
      document.execCommand(command, false, null);
      editorRef.current?.focus();
    };

    const handlePost = async () => {
      if (!userId) {
        alert("User not logged in or user info not loaded yet.");
        return;
      }
      const htmlContent = editorRef.current?.innerHTML;
      const plainText = editorRef.current?.innerText;

      if (!plainText.trim() || selectedClassId.length === 0) { // UPDATED condition
        alert("Please select at least one class and write a message.");
        return;
      }

      const postData = {
        class_id: selectedClassId,
        posted_by: userId,
        message: htmlContent,
      };

      try {
        // NEW: Create multiple posts for each selected class
        const postPromises = selectedClassId.map(classId =>
          axios.post(
            "http://localhost:5000/api/announcement/announcements",
            {
              class_id: classId,
              posted_by: userId,
              message: htmlContent
            }
          )
        );
        const responses = await Promise.all(postPromises)
        responses.forEach((response, index) => {


          if (response.status === 201 || response.status === 200) {
            onNewPost?.({
              ...postData,
              id: response.data.insertId || Date.now(),
              date: new Date().toLocaleDateString(),
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            });
          }
        });

        editorRef.current.innerHTML = "";
        setSelectedClassId("");
        setIsEditorVisible(false);
        closeEditor?.();


      } catch (error) {
        console.error("Error posting announcement:", error);
      }
    };
    if (!isEditorVisible) {
      return null;
    }

    return (
      <div className="p-4 bg-white rounded shadow w-full max-w-3xl mx-auto mb-4">
        {/* Header: Class Selector + Audience */}
        <select name="" id="">
          <div className="mb-4">
            <option value="">
              <div className="flex items-center gap-2 mb-2">

                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="font-medium">Select All Classes</span>
                </label>

              </div>
            </option>
            <option value="">
              <div className="flex flex-wrap gap-3">
                {classList.map((cls) => (
                  <label
                    key={cls.class_id}
                    className="flex items-center gap-1 cursor-pointer bg-gray-50 px-3 py-1 rounded border border-gray-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedClassId.includes(cls.class_id)}
                      onChange={() => toggleClassSelection(cls.class_id)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm">{cls.class_name}</span>
                  </label>
                ))}
              </div>
            </option>
          </div>
        </select>

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
