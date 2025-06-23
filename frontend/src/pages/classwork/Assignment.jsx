import React from 'react'
import { FaBold, FaItalic, FaUnderline, FaRemoveFormat } from "react-icons/fa";
import {
  FaYoutube,
  FaLink,
  FaUpload,
  FaBullhorn,
} from "react-icons/fa";

import { MdFormatListBulleted } from "react-icons/md";
import { useRef, useState } from 'react'
import ClassWorkNav from '../../components/classwork/CalssWorkNav';


const Assignment = () => {
  const [attachments, setAttachnments] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setAttachnments(prev => [...prev, { type: 'file', name: file.name, url: fileURL }])
    }
  };

  const handleLinkInput = (type) => {
    const url = prompt(`past ${type} link here:`);
    if (url) {
      setAttachnments(prev => [...prev, { type, url }]);
    }
  };
  const extractYouTubeID = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S*?v=|(?:v|embed)\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };


  const editorRef = useRef(null);

  const formatText = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
  };
  return (
    <div>
      <ClassWorkNav />
      <div className=" classWorkFeild flex  gap-2">
        <div className="assignmentfeild m-10 h-full p-3 border-1 border-gray-200 rounded-lg">

          <input type="text" className='w-200 h-10 border-b-1 border-gray-500 bg-gray-50 ' />


          <div className='flex  gap-3 mr-2 mt-2'>


            <div className="attachment h-95 w-30 border-2 border-amber-300 rounded-lg ">
              <h2 className='text-center m-2'>Attach</h2>

              <div className="flex flex-col  items-center text-gray-600 mt-5">
                <div className='border-1 border-gray-200 h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-200'> <button onClick={() => handleLinkInput('drive')}><FaBullhorn /></button></div>
                <label htmlFor="" className='mb-2 text-sm font-semibold'>Drive</label>
                <div className='border-1 border-gray-200 h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-200'>   <button onClick={() => handleLinkInput('youtube')}><FaYoutube /></button> </div>
                <label htmlFor="" className='mb-2 text-sm font-semibold'>YouTube</label>

                <label className="cursor-pointer flex flex-col items-center gap-1 font-semibold mb-2 text-sm">
                  <div className='border-1 border-gray-200 h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-200'>

                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <FaUpload />
                  </div>
                  Upload</label>



                <div className='border-1 border-gray-200 h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-200'> <button onClick={() => handleLinkInput('link')}><FaLink /></button> </div>
                <label htmlFor="" className='mb-2 text-sm font-semibold'>Link</label>
              </div>

            </div>
            <div>
              <div className="h-[45vh] w-[47.8vw] border rounded bg-gray-50 flex flex-col relative overflow-hidden">
                {/* Editable area */}
                <div
                  ref={editorRef}
                  contentEditable
                  className="flex-1 overflow-auto p-2"
                  suppressContentEditableWarning={true}
                  data-placeholder="Write your assignment here..."
                  style={{ outline: "none" }}
                >
                  <div><br /></div> {/* Optional space for typing */}
                </div>

                {/* Toolbar at the bottom */}
                <div
                  contentEditable={false}
                  className="flex gap-2 border-t border-gray-300 p-2 bg-white z-10"
                >
                  <button onClick={() => formatText('bold')}><FaBold /></button>
                  <button onClick={() => formatText('italic')}><FaItalic /></button>
                  <button onClick={() => formatText('underline')}><FaUnderline /></button>
                  <button onClick={() => formatText('insertUnorderedList')}><MdFormatListBulleted /></button>
                  <button onClick={() => formatText('removeFormat')}><FaRemoveFormat /></button>
                </div>
              </div>
              <div className="mt-4 flex flex-col">
                <ul className="list-none pl-0 mt-2 space-y-2">
                  {attachments.map((item, index) => (
                    <li key={index} className="flex items-center gap-4 border border-gray-200 rounded-lg h-20 w-[47.8vw] shadow-sm px-4 py-2 bg-white">
                      {item.type === 'file' && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                          📎 {item.name}
                        </a>
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
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">
                          🔗 {item.url}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>

              </div>
            </div>


          </div>


        </div>
        <div className="assignto border-2 border-red-600 h-200 w-90">sadfads</div>

      </div>
    </div >
  )
}

export default Assignment
