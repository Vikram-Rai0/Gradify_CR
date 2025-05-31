import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateMenu() {

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const menuItems = [
    { label: "Assignment", icon: "📋", path: "/assignment" },
    { label: "Quiz assignment", icon: "📝", path: "quiz" },
    { label: "Question", icon: "❓", path: "question" },
    { label: "Material", icon: "📄", path: "material" },
    { label: "Reuse post", icon: "🔁", path: "reuse_post" },
    { label: "Topic", icon: "📂", path: "topic" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }
    return () => {

      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    };
  }, [open]);


  return (
    <div className="relative inline-block text-left h-100 " ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center absolute top-5 left-80 gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Plus size={16} />
        Create
      </button>

      {open && (
        <div
          className="absolute z-10 mt-17 left-80 w-50 bg-white rounded-md shadow-lg ring-opacity-5 "
          role="menu"
        >
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => {
                  setOpen(false);
                  navigate(item.path); // 🔁 Navigate to the right page
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                autoFocus={index === 0}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}