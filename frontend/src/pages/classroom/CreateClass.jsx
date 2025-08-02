import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const CreateClass = () => {
    const [data, setData] = useState({
        class_name: "",
        subject: "",
        section: "",
        invite_code: "",
        semester: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:5000/api/classroom/createclass",
                data,
                { withCredentials: true }
            );

            console.log("Class created: ", res.data);

            // Handle different possible server response formats
            const class_id =
                res.data.class_id ||
                res.data.id ||
                res.data._id ||
                res.data.data?.class_id;

            if (!class_id) {
                console.error("No class_id returned from server", res.data);
                return;
            }

            // Ensure class_id is a string
            const classIdString = String(class_id);

            // Correct redirect path
            const navigate = useNavigate;
            navigate(`/classroom/${classIdString}/stream`);

            // Reset form
            setData({
                class_name: "",
                subject: "",
                section: "",
                semester: "",
                invite_code: ""
            });

        } catch (err) {
            console.error("Error creating class: ", err.response?.data || err.message);
        }
    };

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className="formContainer border border-gray-300 rounded-md w-[50%] p-4 shadow bg-white">
                <h1 className='text-2xl font-semibold text-gray-700 mb-3'>Create Class</h1>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <input type="text" name="class_name" value={data.class_name} onChange={handleChange} placeholder='Class Name' className='w-full h-12 pl-2 rounded-sm border-b-2 border-[#456882] bg-gray-50 focus:outline-none focus:ring-0' />
                    <input type="text" name="section" value={data.section} onChange={handleChange} placeholder='Section' className='w-full h-12 pl-2 rounded-sm border-b-2 border-[#456882] bg-gray-50 focus:outline-none focus:ring-0' />
                    <input type="text" name="subject" value={data.subject} onChange={handleChange} placeholder='Subject' className='w-full h-12 pl-2 rounded-sm border-b-2 border-[#456882] bg-gray-50 focus:outline-none focus:ring-0' />
                    <input type="text" name="semester" value={data.semester} onChange={handleChange} placeholder='Semester' className='w-full h-12 pl-2 rounded-sm border-b-2 border-[#456882] bg-gray-50 focus:outline-none focus:ring-0' />
                    <input type="text" name="invite_code" value={data.invite_code} onChange={handleChange} placeholder='Invite Code' className='w-full h-12 pl-2 rounded-sm border-b-2 border-[#456882] bg-gray-50 focus:outline-none focus:ring-0' />

                    <div className='flex justify-end gap-2'>
                        <button
                            type="button"
                            onClick={() => setData({
                                class_name: "",
                                subject: "",
                                section: "",
                                semester: "",
                                invite_code: ""
                            })}
                            className='rounded-md border border-red-500 hover:bg-red-500 bg-red-600 shadow px-4 py-2 text-white'
                        >
                            Cancel
                        </button>
                        <button type="submit" className='rounded-md border border-[#456882] hover:bg-[#2e4557] bg-[#1B3C53] shadow px-4 py-2 text-white'>
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateClass;