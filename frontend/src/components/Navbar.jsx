import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa6";
import { SiGoogleclassroom } from "react-icons/si";
import { IoIosAdd } from "react-icons/io";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const Navbar = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const popupRef = useRef(null);
  const notesRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const canCreate = ["Instructor", "Admin", "Supervisor"].includes(user?.role);
  const initials = (user?.name || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const unread = notes.filter((n) => !n.read_status).length;

  const loadNotes = () => {
    api
      .get("/api/notifications")
      .then((res) => setNotes(Array.isArray(res.data) ? res.data : []))
      .catch(() => setNotes([]));
  };

  useEffect(() => {
    loadNotes();
    const timer = setInterval(loadNotes, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (notesRef.current && !notesRef.current.contains(event.target)) {
        setNotesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative bg-white shadow-sm">
      <nav className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            aria-label="Toggle sidebar"
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <FaBars className="text-lg" />
          </button>
          <button
            className="flex items-center gap-2"
            onClick={() => navigate("/home")}
          >
            <SiGoogleclassroom className="text-2xl text-green-600" />
            <span className="text-xl font-semibold text-blue-800 hidden sm:inline">
              Classroom
            </span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={notesRef}>
            <button
              aria-label="Notifications"
              onClick={() => setNotesOpen((prev) => !prev)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 text-center">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>
            {notesOpen && (
              <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="flex items-center justify-between px-3 py-2 border-b">
                  <span className="text-sm font-semibold">Notifications</span>
                  <button
                    className="text-xs text-blue-600"
                    onClick={async () => {
                      await api.patch("/api/notifications/read-all");
                      loadNotes();
                    }}
                  >
                    Mark all read
                  </button>
                </div>
                {notes.length === 0 ? (
                  <p className="p-3 text-sm text-gray-500">No notifications.</p>
                ) : (
                  notes.map((note) => (
                    <button
                      key={note.notif_id}
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                        note.read_status ? "text-gray-500" : "text-gray-800"
                      }`}
                      onClick={async () => {
                        if (!note.read_status) {
                          await api.patch(`/api/notifications/${note.notif_id}/read`);
                        }
                        setNotesOpen(false);
                        if (note.link) navigate(note.link);
                        else loadNotes();
                      }}
                    >
                      <p>{note.message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(note.created_at).toLocaleString()}
                      </p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              aria-haspopup="true"
              aria-expanded={isOpen}
            >
              <IoIosAdd className="text-3xl text-gray-700" />
            </button>
            {isOpen && (
              <div
                ref={popupRef}
                className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50"
              >
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/join-class");
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Join Class
                </button>
                {canCreate && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/create-class");
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Create Class
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate(user?.role === "Admin" ? "/dlayout" : "/settings")}
            className="h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold"
            title={user?.name || "Account"}
          >
            {initials}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
