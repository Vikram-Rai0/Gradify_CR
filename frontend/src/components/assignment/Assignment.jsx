import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaBold, FaItalic, FaUnderline, FaRemoveFormat,
  FaYoutube, FaLink, FaUpload, FaBullhorn
} from "react-icons/fa";
import { MdFormatListBulleted } from "react-icons/md";
import ClassWorkNav from '../../components/classwork/CalssWorkNav';

const Assignment = () => {
  const editorRef = useRef(null);

  const [attachments, setAttachments] = useState([]);
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [gradingType, setGradingType] = useState('Manual');
  const [allowLate, setAllowLate] = useState(false);
  const [classList, setClassList] = useState([]);
  const [files, setFiles] = useState([]);

  const [userId, setUserId] = useState(null);

  // Fetch user and class list
  useEffect(() => {
    axios.get("http://localhost:5000/api/user/me", { withCredentials: true })
      .then(res => setUserId(res.data.user_id))
      .catch(err => console.error("Failed to fetch user:", err));

    axios.get("http://localhost:5000/api/classroom/getClassroom", { withCredentials: true })
      .then(res => setClassList(res.data))
      .catch(err => console.error("Failed to fetch class list", err));
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => [...prev, file]);
      const fileURL = URL.createObjectURL(file);
      setAttachments(prev => [...prev, {
        type: 'file',
        name: file.name,
        url: fileURL
      }]);
    }
  };

  const handleLinkInput = (type) => {
    const url = prompt(`Paste ${type} link here:`);
    if (url) {
      setAttachments(prev => [...prev, { type, url }]);
    }
  };

  const extractYouTubeID = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S*?v=|(?:v|embed)\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
    editorRef.current?.focus();
  };

  const handleSubmit = async () => {

    if (!title.trim() || !classId) {
      alert("Please enter title and select a class.");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', editorRef.current?.innerHTML);
    formData.append('due_date', dueDate);
    formData.append('grading_type', gradingType);
    formData.append('allow_late', allowLate);

    // Append files
    files.forEach(file => {
      formData.append('attachments', file);
    });
    try {
      await axios.post(
        `http://localhost:5000/api/classwork/${classId}/postAssignment`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert("Assignment created successfully!");
      // Reset form
      setTitle('');
      setClassId('');
      setDueDate('');
      setGradingType('Manual');
      setAllowLate(false);
      setAttachments([]);
      setFiles([]);
      editorRef.current.innerHTML = '';

    } catch (error) {
      console.error(error);
      alert("Failed to create assignment.");
    }
  };

  return (
    <div className='bg-gray-50'>
      <ClassWorkNav title="Assignment" />
      <div className="classWorkFeild flex justify-between gap-2">
        <div className="assignmentfeild m-10 h-full p-3 border border-[#E3F4F4] rounded-lg bg-white w-full max-w-[70%]">

          <input
            type="text"
            placeholder='Title*'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='title w-full h-10 border-b border-gray-500 bg-gray-50 mb-4 p-2'
          />

          <div className='flex gap-3'>
            {/* Attachment sidebar */}
            <div className="attachment w-40 border-2 border-amber-300 rounded-lg p-2">
              <h2 className='text-center font-semibold'>Attach</h2>
              <div className="flex flex-col items-center text-gray-600 mt-3 gap-3">
                <button onClick={() => handleLinkInput('drive')}><FaBullhorn /></button>
                <button onClick={() => handleLinkInput('youtube')}><FaYoutube /></button>
                <label className="cursor-pointer">
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                  <FaUpload />
                </label>
                <button onClick={() => handleLinkInput('link')}><FaLink /></button>
              </div>
            </div>

            {/* Text editor */}
            <div className="w-full">
              <div className="text-editor h-[45vh] border border-gray-300 rounded bg-gray-50 flex flex-col overflow-hidden">
                <div
                  ref={editorRef}
                  contentEditable
                  className="flex-1 overflow-auto p-2"
                  suppressContentEditableWarning={true}
                  data-placeholder="Write your assignment here..."
                  style={{ outline: "none" }}
                ></div>

                <div className="flex gap-2 border-t border-[#E3F4F4] p-2 bg-white z-10">
                  <button onClick={() => formatText('bold')}><FaBold /></button>
                  <button onClick={() => formatText('italic')}><FaItalic /></button>
                  <button onClick={() => formatText('underline')}><FaUnderline /></button>
                  <button onClick={() => formatText('insertUnorderedList')}><MdFormatListBulleted /></button>
                  <button onClick={() => formatText('removeFormat')}><FaRemoveFormat /></button>
                </div>
              </div>

              {/* Attachment previews */}
              <div className="mt-4">
                <ul className="space-y-2">
                  {attachments.map((item, index) => (
                    <li key={index} className="flex items-center gap-4 border border-[#E3F4F4] rounded-lg h-20 shadow-sm px-4 py-2 bg-white">
                      {item.type === 'file' && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">📎 {item.name}</a>
                      )}
                      {item.type === 'youtube' && (
                        <iframe
                          width="300"
                          height="65"
                          src={`https://www.youtube.com/embed/${extractYouTubeID(item.url)}`}
                          title="YouTube video"
                          className="rounded"
                          allowFullScreen
                        ></iframe>
                      )}
                      {(item.type === 'drive' || item.type === 'link') && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">🔗 {item.url}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Post button */}
          <div className='mt-6 flex justify-end'>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Post Assignment
            </button>
          </div>
        </div>

        {/* Sidebar panel */}
        <div className="assignto border-l-2 border-gray-400 p-6 w-96">
          <div className='flex flex-col gap-4'>
            <label className='font-semibold text-gray-600'>For</label>
            <select
              className='bg-[#E3F4F4] h-14 rounded-md'
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

            <label className='font-semibold text-gray-600'>Grading Type</label>
            <select className='bg-[#E3F4F4] h-14 rounded-md' value={gradingType} onChange={(e) => setGradingType(e.target.value)}>
              <option value="Manual">Manual</option>
              <option value="Auto">Auto</option>
            </select>

            <label className='font-semibold text-gray-600'>Allow Late Submission</label>
            <input type="checkbox" checked={allowLate} onChange={(e) => setAllowLate(e.target.checked)} />

            <label className='font-semibold text-gray-600'>Due Date</label>
            <input
              type="datetime-local"
              className='bg-[#E3F4F4] h-14 rounded-md px-2'
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignment;
