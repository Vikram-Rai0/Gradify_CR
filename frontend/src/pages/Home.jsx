// src/pages/GetClasses.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GetClasses = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bannerImages = [
    "/banner1.avif",
    "/banner2.avif",
    "/banner3.avif",
    "/banner4.avif",
  ];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/classroom/getclassroom', {
          withCredentials: true,
        });
        setClasses(res.data);
      } catch (err) {
        console.error("Error fetching classroom:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleClassClick = (classId) => {
    navigate(`/classroom/${classId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600 text-lg font-semibold">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-[#1B3C53]">📚 My Classes</h1>
      {classes.length === 0 ? (
        <p className="text-gray-500 text-center">No classes available yet. Join or create one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {classes.map((cls, index) => {
            const imgSrc = bannerImages[index % bannerImages.length];
            return (
              <div
                key={cls.class_id || index}
                onClick={() => handleClassClick(cls.class_id)}
                className="group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white"
              >
                {/* Banner */}
                <div
                  className="h-40 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${imgSrc})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end p-4">
                    <h2 className="text-white text-lg font-semibold">{cls.class_name}</h2>
                  </div>
                </div>

                {/* Class Details */}
                <div className="p-4 space-y-2">
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Subject:</span> {cls.subject}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Semester:</span> {cls.semester}
                  </p>
                </div>

                {/* Footer */}
                <div className="px-4 py-2 bg-gray-50 text-right">
                  <span className="text-green-600 text-xs font-medium group-hover:underline">
                    View Class →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GetClasses;
