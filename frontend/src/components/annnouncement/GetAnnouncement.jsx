import React, { useEffect, useState } from "react";
import axios from "axios";

const GetAnnouncement = ({ classId }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/announcement/${classId}?limit=10`);
        // Ensure we always get an array
        setAnnouncements(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
        setError("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };

    if (classId) fetchAnnouncements();
  }, [classId]);

  if (loading) return <p>Loading announcements...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {announcements.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        announcements.map((a) => (
          <div
            key={a.announcement_id}
            className="p-2 mb-2 border rounded bg-gray-100"
          >
            <p className="font-semibold">{a.name}</p>
            <p>{a.message}</p>
            <span className="text-sm text-gray-500">
              {new Date(a.created_at).toLocaleString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default GetAnnouncement;
