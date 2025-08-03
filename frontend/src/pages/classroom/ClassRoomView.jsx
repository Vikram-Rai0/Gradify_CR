// src/pages/ClassroomView.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ClassroomView = () => {
    const { classId } = useParams();
    const [classroom, setClassroom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClassroom = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/classroom/${classId}`, {
                    withCredentials: true,
                });
                setClassroom(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error loading classroom:", err);
                setError("Failed to load class.");
                setLoading(false);
            }
        };

        fetchClassroom();
    }, [classId]);

    if (loading) return <p className="text-center mt-10">Loading class...</p>;
    if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-[#1B3C53] mb-4">{classroom.class_name}</h1>
            <p className="text-lg"><strong>Subject:</strong> {classroom.subject}</p>
            <p className="text-lg"><strong>Semester:</strong> {classroom.semester}</p>
            <p className="text-sm text-gray-500 mt-6">Class ID: {classId}</p>
        </div>
    );
};

export default ClassroomView;
