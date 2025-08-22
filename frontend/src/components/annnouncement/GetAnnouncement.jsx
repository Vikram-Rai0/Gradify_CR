import React, { useEffect, useState } from "react";
import axios from "axios";

const GetAnnouncement = ({ classId, reload, renderItem, onDataFetched }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError("");

        // Fixed URL to match your backend route
        const res = await axios.get(
          `http://localhost:5000/api/announcement/getannouncement/${classId}?limit=10`,
          { withCredentials: true }
        );

        console.log("Announcements response:", res.data);

        // Ensure we always get an array
        const fetchedAnnouncements = Array.isArray(res.data) ? res.data : [];
        setAnnouncements(fetchedAnnouncements);

        // Pass data back to parent component if callback is provided
        if (onDataFetched) {
          onDataFetched(fetchedAnnouncements);
        }
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
        setError("Failed to load announcements");
        setAnnouncements([]); // Reset to empty array on error

        // Pass empty array to parent on error
        if (onDataFetched) {
          onDataFetched([]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchAnnouncements();
    }
  }, [classId, reload, onDataFetched]); // Added onDataFetched to dependencies

  // If onDataFetched is provided, this component is being used for data only
  if (onDataFetched) {
    return null; // Don't render anything, just fetch data
  }

  // Original rendering logic for when used standalone
  if (loading) return <p className="text-center text-gray-500">Loading announcements...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      {announcements.length === 0 ? (
        <p className="text-center text-gray-500">No announcements yet.</p>
      ) : (
        announcements.map((announcement) => {
          // If renderItem prop is provided, use it for custom rendering
          if (renderItem) {
            return (
              <div key={announcement.announcement_id}>
                {renderItem({
                  ...announcement,
                  title: "Announcement", // Add title for consistency with Stream component
                  content: announcement.message, // Map message to content
                  created_at: announcement.created_at
                })}
              </div>
            );
          }

          // Default rendering
          return (
            <div
              key={announcement.announcement_id}
              className="p-4 mb-4 border rounded-lg bg-white shadow-sm"
            >
              {/* <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-gray-800">{announcement.name}</p>
                <span className="text-sm text-gray-500">
                  {new Date(announcement.created_at).toLocaleString()}
                </span>
              </div> */}
              <div
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: announcement.message }}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default GetAnnouncement;