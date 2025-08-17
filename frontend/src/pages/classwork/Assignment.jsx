import { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaRemoveFormat,
  FaYoutube,
  FaLink,
  FaUpload,
  FaBullhorn,
} from "react-icons/fa";
import { MdFormatListBulleted } from "react-icons/md";
import ClassWorkNav from "../../components/classwork/CalssWorkNav";
import { useNavigate } from "react-router-dom";

const Assignment = () => {
  const editorRef = useRef(null);

  const [attachments, setAttachments] = useState([]);
  const [title, setTitle] = useState("");
  const [classId, setClassId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [points, setPoints] = useState(null);
  const [allowLate, setAllowLate] = useState(false);
  const [classList, setClassList] = useState([]);
  const [files, setFiles] = useState([]);
  const [userId, setUserId] = useState(null);

  // Fetch user and class list
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/me", { withCredentials: true })
      .then((res) => setUserId(res.data.user_id))
      .catch((err) => console.error("Failed to fetch user:", err));

    axios
      .get("http://localhost:5000/api/classroom/getClassroom", {
        withCredentials: true,
      })
      .then((res) => setClassList(res.data))
      .catch((err) => console.error("Failed to fetch class list", err));
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => [...prev, file]);
      const fileURL = URL.createObjectURL(file);
      setAttachments((prev) => [
        ...prev,
        { type: "file", name: file.name, url: fileURL },
      ]);
    }
  };

  const handleLinkInput = (type) => {
    const url = prompt(`Paste ${type} link here:`);
    if (url) {
      setAttachments((prev) => [...prev, { type, url }]);
    }
  };

  const extractYouTubeID = (url) => {
    const regex =
      /(?:youtube\.com\/(?:[^/\n\s]+\/\S*?v=|(?:v|embed)\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
    editorRef.current?.focus();
  };
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title.trim() || !classId) {
      alert("Please enter title and select a class.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", editorRef.current?.innerHTML);
    formData.append("due_date", dueDate);
    formData.append("points", points);
    formData.append("allow_late", allowLate);

    files.forEach((file) => {
      formData.append("attachments", file);
    });
    try {
      await axios.post(
        `http://localhost:5000/api/classwork/${classId}/postAssignment`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Assignment created successfully!");
      setTitle("");
      setClassId("")
      setDueDate("");
      setPoints(100);
      setAllowLate(false);
      setAttachments([]);
      setFiles([]);
      editorRef.current.innerHTML = "";
      navigate("/stream");
    } catch (error) {
      console.error(error);
      alert("Failed to create assignment.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ClassWorkNav title="Assignment" />

      <div className="flex flex-col lg:flex-row gap-6 px-6 py-8">
        {/* Assignment form */}
        <div className="bg-white rounded-lg shadow-md p-6 flex-1">
          {/* Title input */}
          <input
            type="text"
            placeholder="Assignment Title*"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-b border-gray-300 focus:border-blue-500 outline-none text-lg font-medium py-2 mb-4"
          />

          <div className="flex flex-col md:flex-row gap-4">
            {/* Attachment panel */}
            <div className="w-full md:w-48 border border-gray-200 rounded-lg p-3 bg-gray-50">
              <h2 className="text-center font-semibold text-gray-700">Attach</h2>
              <div className="flex flex-col items-center text-gray-600 mt-4 gap-5">
                <button
                  className="hover:text-blue-600"
                  onClick={() => handleLinkInput("drive")}
                >
                  <FaBullhorn />
                </button>
                <button
                  className="hover:text-red-600"
                  onClick={() => handleLinkInput("youtube")}
                >
                  <FaYoutube />
                </button>
                <label className="cursor-pointer hover:text-green-600">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <FaUpload />
                </label>
                <button
                  className="hover:text-purple-600"
                  onClick={() => handleLinkInput("link")}
                >
                  <FaLink />
                </button>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1">
              <div className="border border-gray-200 rounded-lg bg-white flex flex-col overflow-hidden">
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="flex-1 p-3 min-h-[200px] focus:outline-none"
                  placeholder="Write your assignment here..."
                ></div>

                {/* Toolbar */}
                <div className="flex gap-3 border-t border-gray-200 p-2 bg-gray-50">
                  <button
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={() => formatText("bold")}
                  >
                    <FaBold />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={() => formatText("italic")}
                  >
                    <FaItalic />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={() => formatText("underline")}
                  >
                    <FaUnderline />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={() => formatText("insertUnorderedList")}
                  >
                    <MdFormatListBulleted />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={() => formatText("removeFormat")}
                  >
                    <FaRemoveFormat />
                  </button>
                </div>
              </div>

              {/* Attachment previews */}
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 border border-gray-200 rounded-lg p-2 bg-gray-50"
                    >
                      {item.type === "file" && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          📎 {item.name}
                        </a>
                      )}
                      {item.type === "youtube" && (
                        <iframe
                          width="300"
                          height="65"
                          src={`https://www.youtube.com/embed/${extractYouTubeID(
                            item.url
                          )}`}
                          title="YouTube video"
                          className="rounded"
                          allowFullScreen
                        ></iframe>
                      )}
                      {(item.type === "drive" || item.type === "link") && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 underline"
                        >
                          🔗 {item.url}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Post button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Post Assignment
            </button>
          </div>
        </div>

        {/* Assignment settings */}
        <div className="bg-white rounded-lg shadow-md p-6 w-full lg:w-96 fit">
          <div className="flex flex-col gap-5">
            <div>
              <label className="font-semibold text-gray-600">For</label>
              <select
                className="w-full bg-gray-50 h-12 rounded-md border border-gray-200 px-2 mt-1"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
              >
                <option value="">-- Select a class --</option>
                {classList.map((cls) => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.class_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-600">Points</label>
              <div
                className="w-full bg-gray-50 h-12 rounded-md border border-gray-200 px-2 mt-1"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              >
                <input type="text" />
              </div>

            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allowLate}
                onChange={(e) => setAllowLate(e.target.checked)}
              />
              <label className="font-semibold text-gray-600">
                Allow Late Submission
              </label>
            </div>

            <div>
              <label className="font-semibold text-gray-600">Due Date</label>
              <input
                type="datetime-local"
                className="w-full bg-gray-50 h-12 rounded-md border border-gray-200 px-2 mt-1"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignment;
