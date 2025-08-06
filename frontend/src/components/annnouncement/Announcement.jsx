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
  FaChevronDown,
} from "react-icons/fa";

const Announcement = forwardRef(
  (
    { onNewPost, closeEditor, editorOnly = false, hideFooterButtons = false, currentClassId = null },
    ref
  ) => {
    const editorRef = useRef(null);
    const dropdownRef = useRef(null);
    const [selectedClassId, setSelectedClassId] = useState([]);
    const [userId, setUserId] = useState(null);
    const [classList, setClassList] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isEditorVisible, setIsEditorVisible] = useState(true);

    // Fetch user and class list
    useEffect(() => {

      axios
        .get("http://localhost:5000/api/user/me", { withCredentials: true })
        .then((res) => {
          console.log("User data:", res.data);
          setUserId(res.data.user_id);

        })
        .catch((err) => {
          console.error("Failed to fetch current user:", err);
        });

      axios
        .get("http://localhost:5000/api/classroom/getClassroom", { withCredentials: true })
        .then((res) => {
          console.log("Classroom Data", res.data);
          setClassList(res.data);
        }
        )


        .catch((err) => console.error("Failed to fetch class list", err));


    }, [currentClassId]);

    // handleclickOutSide for drop down 
    useEffect(() => {
      const handleClickOutSide = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutSide);
      return () => {
        document.removeEventListener("mousedown", handleClickOutSide);
      };
    }, []);

    const toggleClassSelection = (classId) => {
      if (selectedClassId.includes(classId)) {
        setSelectedClassId(selectedClassId.filter((id) => id !== classId));
      } else {
        setSelectedClassId([...selectedClassId, classId]);
      }
    };

    const toggleSelectAll = () => {
      if (selectAll) {
        setSelectedClassId([]);
      } else {
        setSelectedClassId(classList.map((cls) => cls.class_id));
      }
      setSelectAll(!selectAll);
    };

    const getSelectedClassNames = () => {
      if (selectedClassId.length === 0) return "Select class";
      if (selectedClassId.length === classList.length) return "All classes";
      const names = classList
        .filter((cls) => selectedClassId.includes(cls.class_id))
        .map((cls) => cls.class_name);
      return names.join(", ");
    };

    useImperativeHandle(ref, () => ({
      getContent: () => editorRef.current?.innerHTML || "",
    }));

    const formatText = (command) => {
      document.execCommand(command, false, null);
      editorRef.current?.focus();
    };

    const handlePost = async () => {
      if (!userId) {
        alert("User not logged in.");
        return;
      }

      const htmlContent = editorRef.current?.innerHTML;
      const plainText = editorRef.current?.innerText;

      if (!plainText.trim() || selectedClassId.length === 0) {
        alert("Please select at least one class and write a message.");
        return;
      }

      try {
        const postPromises = selectedClassId.map((classId) =>
          axios.post("http://localhost:5000/api/announcement/postannouncement",
            {
              class_id: classId,
              message: htmlContent,
            }, { withCredentials: true })
        );
        // Reset state
        editorRef.current.innerHTML = "";
        setSelectedClassId([]);
        setSelectAll(false);

        // Hide the editor
        closeEditor?.();
        const responses = await Promise.all(postPromises);

        responses.forEach((response) => {
          if (response.status === 200 || response.status === 201) {
            onNewPost?.({
              announcement_id: response.data.insertId || Date.now(),
              posted_by: userId,
              message: htmlContent,
              class_id: selectedClassId,
              date: new Date().toLocaleDateString(),
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            });
          }
        }
        );



      } catch (error) {
        console.error("Error posting announcement:", error);
      }
    };


    // get announcement 

    return (
      <div className="p-4 bg-white rounded shadow w-full max-w-3xl mx-auto mb-4 relative">
        {/* Class Dropdown */}
        <div className="mb-4 relative w-50">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full border rounded px-4 py-2 flex justify-between items-center"
          >
            <span className="text-sm text-gray-700">{getSelectedClassNames()}</span>
            <FaChevronDown />
          </button>

          {dropdownOpen && (

            <div ref={dropdownRef} className="absolute z-10 mt-2 w-full bg-gray-100 border rounded shadow p-2 max-h-64 overflow-auto">
              <label className="flex items-center gap-2 mb-2 hover:bg-white p-1 rounded-sm">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 "
                />
                <span className="text-sm font-medium ">Select All</span>
              </label>

              {classList.map((cls) => (
                <label
                  key={cls.class_id}
                  className="flex items-center gap-2 mb-1 cursor-pointer hover:bg-white p-1 rounded-sm h-7"
                >
                  <input
                    type="checkbox"
                    checked={selectedClassId.includes(cls.class_id)}
                    onChange={() => toggleClassSelection(cls.class_id)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">{cls.class_name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex gap-2 text-gray-600 mb-2">
          {[["bold", <FaBold />], ["italic", <FaItalic />], ["underline", <FaUnderline />], ["insertUnorderedList", <FaListUl />], ["strikeThrough", <FaStrikethrough />]].map(([cmd, icon]) => (
            <button
              key={cmd}
              onClick={() => formatText(cmd)}
              className="border p-1 h-7 rounded hover:bg-gray-200"
            >
              {icon}
            </button>
          ))}
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
            <div className="flex gap-4 text-gray-600">
              <FaBullhorn />
              <FaYoutube />
              <label className="cursor-pointer flex items-center gap-1">
                <input type="file" className="hidden" />
                <FaUpload />
              </label>
              <FaLink />
            </div>

            {!hideFooterButtons && (
              <div className="flex gap-2">
                <button
                  onClick={closeEditor}
                  className="text-red-600 border border-red-500 px-4 py-1 rounded"
                >
                  Cancel
                </button>
                {isEditorVisible && (


                  <button
                    onClick={handlePost}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Post
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default Announcement;
