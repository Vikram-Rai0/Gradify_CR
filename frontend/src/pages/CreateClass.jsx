import React, { useState } from 'react'
import axios from 'axios';

const CreateClass = () => {
    const [data, setData] = useState({
        name: "",
        section: "",
        Subject: "",
        semester: "",
        code: ""
    })

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
            const res = await axios.post("http://localhost:5000/api/createclass", data);
            console.log("Class created: ", res.data);
        } catch (err) {
            console.error("Error creating class: ", err);
        }
    };
    return (
        <div className='flex justify-center items-center h-screen  '>
            <div className="formContainer border-1 border-gray-300 rounded-md w-[50%] p-4 shadow">
                <h1 className='text-2xl font-semibold text-gray-700 mb-3'>Create class</h1>
                <form action="post" className='flex flex-col gap-4 ' onSubmit={handleSubmit}>
                    <input type="text" name="name" onChange={handleChange} placeholder='Section' className='w-full h-13 pl-2 rounded-sm border-b-2 border-[#456882] bg-gray-50 focus:outline-none focus:ring-0' />
                    <input type="text" name="section" onChange={handleChange} placeholder='Subject' className='w-full h-13 pl-2 rounded-sm border-b-2 border-[#456882] bg-gray-50 focus:outline-none focus:ring-0' />
                    <input type="text" name="subject" onChange={handleChange} placeholder='Semester' className='w-full h-13 pl-2 rounded-sm border-b-2 border-[#456882] bg-gray-50 focus:outline-none focus:ring-0' />
                    <input type="text" name="semester" onChange={handleChange} placeholder='Invite-code' className='w-full h-13 pl-2 rounded-sm border-b-2 border-[#456882] bg-gray-50 focus:outline-none focus:ring-0' />
                    <input type="text" name="code" onChange={handleChange} placeholder='Class name' className='w-full h-13 pl-2 rounded-sm border-b-2 border-[#456882] bg-gray-50 focus:outline-none focus:ring-0' />
                    <div className='gap-1 flex justify-end'>
                        <button className='border-1  rounded-md border-red-500 hover:bg-red-500 bg-red-600 shadow-2xl px-4 py-2 text-white'>Cancle</button>
                        <input type="submit" className='border-1  rounded-md border-[#456882] hover:bg-[#2e4557] shadow-2xl px-4 py-2 text-white bg-[#1B3C53]' />
                    </div>

                </form>
            </div>
        </div>
    )
}

export default CreateClass
