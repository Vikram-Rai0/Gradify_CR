// src/components/GetAnnouncement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const GetAnnouncement = ({ reload }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [error, setError] = useState(null);

    const { classId } = useParams();
    useEffect(() => {

        if (!classId) return alert("no classId found");

        const fetchAnnouncements = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/announcement/class/${classId}/getannouncementsByClasses`,
                    { withCredentials: true }
                );


                setAnnouncements(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('Error fetching announcements:', err);
                setError('Failed to load announcements.');
            }
        };

        fetchAnnouncements();
    }, [classId, reload]);

    // ... existing imports and component code ...

    return (
        <div className="w-full max-w-[900px] mt-6 px-4">
            {error && <p className="text-red-500">{error}</p>}
            {announcements.length === 0 ? (
                <p className="text-gray-500">No announcements yet.</p>
            ) : (
                <ul className="space-y-4">
                    {announcements.map((a, index) => {
                        // Use announcement_id if available, otherwise fallback to index
                        const key = a.announcement_id ?? index;
                        return (
                            <li
                                key={key}
                                className="p-4 bg-gray-100 rounded-lg shadow"
                            >
                                <div className="text-sm text-gray-600 mb-1">
                                    Posted by: {a.name} | {new Date(a.created_at).toLocaleString()}
                                </div>
                                <div className="text-gray-800">{a.message}</div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default GetAnnouncement;
