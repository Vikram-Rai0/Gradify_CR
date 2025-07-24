import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GetClasses = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const bannerImages = ["../../public/banner1.avif", "../../public/banner2.avif", "../../public/banner3.avif", "../../public/banner4.avif",];


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
    const handleClassClick = (classId) => {
        navigate(`/class/${classId}`)
    }
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-[#1B3C53]">All Classes</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-250">
                {classes.map((cls, index) => {
                    const imgSrc = bannerImages[index % bannerImages.length];
                    return (
                        <div
                            key={cls.id || index}
                            className="border border-gray-300 rounded-lg shadow-md bg-white overflow-hidden flex flex-col hover:shadow-lg"
                            onClick={handleClassClick}
                        >
                            <h2 className="bg-gray-100 text-[#1B3C53] font-semibold text-xl px-5 py-3 border-b border-gray-300">
                                {cls.class_name}
                            </h2>
                            <div
                                className="flex-grow bg-cover bg-center relative"
                                style={{ backgroundImage: `url(${imgSrc})`, minHeight: '160px' }}
                            >
                                <div className="absolute  inset-0 bg-opacity-30 flex items-center justify-center text-white font-semibold text-lg">
                                    User Profile
                                </div>
                            </div>
                            <div className="px-5 py-3 border-t border-gray-300 bg-white text-[#456882] text-sm">
                                <p>
                                    <strong>Subject:</strong> {cls.subject}
                                </p>
                                <p>
                                    <strong>Semester:</strong> {cls.semester}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GetClasses;
