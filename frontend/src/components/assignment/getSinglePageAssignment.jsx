import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const GetSinglePageAssignment = () => {
  const { classId, assignId } = useParams(); // Get classId and assignId from URL
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/classwork/${classId}/getAssignment/${assignId}`, {
        withCredentials: true,
      })
      .then((res) => setAssignment(res.data))
      .catch((err) => console.error(err));
  }, [classId, assignId]);

  if (!assignment) return <p>Loading assignment...</p>;

  return (
    <div>
      <h1>{assignment.title}</h1>
      <p>{assignment.description}</p>
      <p>Posted on: {new Date(assignment.created_at).toLocaleString()}</p>
    </div>
  );
};

export default GetSinglePageAssignment;
