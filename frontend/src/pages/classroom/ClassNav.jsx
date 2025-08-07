import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
const ClassNav = () => {
  const { classId } = useParams();
  
  // Add null check for safety
  if (!classId) return <div>Loading...</div>;

  return (
    <div className="border-b border-gray-300 rounded-t-3xl  h-12">
      <ul className="flex gap-6 h-full items-center pl-10 text-gray-800">
        <li>
          <Link to={`/classroom/${classId}/stream`}>Stream</Link>
        </li>
        <li>
          <Link to={`/classroom/${classId}/classwork`}>Classwork</Link>
        </li>
        <li>
          <Link to={`/classroom/${classId}/people`}>People</Link>
        </li>
      </ul>
    </div>
  );
};
export default ClassNav;