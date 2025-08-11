import { useParams, NavLink } from "react-router-dom";

const ClassNav = () => {
  const { classId } = useParams();

  if (!classId) return <div className="p-4">Loading...</div>;

  const navItems = [
    { name: "Stream", path: `/classroom/${classId}/stream` },
    { name: "Classwork", path: `/classroom/${classId}/classwork` },
    { name: "People", path: `/classroom/${classId}/people` },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm rounded-t-3xl">
      <ul className="flex gap-8 px-10 h-12 items-center text-gray-700 font-medium">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `relative transition-colors duration-200 hover:text-blue-600 ${isActive ? "text-blue-600 font-semibold" : ""
                }`
              }
            >
              {item.name}
              {/* Active underline */}
              <span
                className={({ isActive }) =>
                  isActive
                    ? "absolute left-0 -bottom-[6px] h-[2px] w-full bg-blue-600 rounded-full"
                    : ""
                }
              ></span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ClassNav;
