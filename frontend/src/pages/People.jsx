import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"
const People = () => {
  const [members, setMembers] = useState([]);
  const [creator, setCreator] = useState(null);
  const { classId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/classroom/${classId}/fetchClassroomMembers`,
          { withCredentials: true }
        );

        setMembers(response.data.members || []);
        setCreator(response.data.creator || null);
      } catch (error) {
        console.log("Error", error.response?.data || error.message);
      }
    };
    fetchUser();
  }, [classId]);

  return (
    <div className="max-w-4xl mx-auto p-4 ">
      <h2 className="text-2xl font-extrabold mb-4 pl-2  text-blue-800">Classroom Members</h2>

      {creator && (
        <div className="flex items-center p-2 gap-3 border-b border-gray-300 mb-10">
           <div className="w-10 h-10 rounded-full bg-gray-700 flex  flex-col items-center justify-center text-white font-bold text-sm">
                {creator.name[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{creator.name}</p>

              </div>
          
          
        </div>
      )}
      <h1 className="font-extrabold text-lg text-blue-800 pl-2">Students</h1>
      {members.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {members.map((user) => (
            <li
              key={user.user_id}
              className=" border-b border-gray-300 p-2 flex  items-center space-x-3 "
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex  flex-col items-center justify-center text-white font-bold text-sm">
                {user.name[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{user.name}</p>

              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-4">No users found in this class.</p>
      )}
    </div>
  );
};
export default People;