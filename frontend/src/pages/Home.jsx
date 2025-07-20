import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GetClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/getclassroom');
                setClasses(res.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data || err.message);
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading classes...</p>;
    if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>;

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold mb-4'>All Classes</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {classes.map((cls, index) => (
                    <div key={index} className='border rounded-md shadow-md p-4 bg-white'>
                        <h2 className='text-xl font-semibold text-[#1B3C53]'>{cls.class_name}</h2>
                        <p><strong>Section:</strong> {cls.section}</p>
                        <p><strong>Subject:</strong> {cls.subject}</p>
                        <p><strong>Semester:</strong> {cls.semester}</p>
                        <p><strong>Invite Code:</strong> {cls.invite_code}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GetClasses;
