// AppRoutes.js
import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from '../pages/Home';
import Calander from '../pages/Calender';
import ClassNav from '../pages/ClassNav';
import Teaching from '../pages/Teaching';
import Settings from '../pages/Settings';
import Layout from '../layouts/SidebarLayout';
import ClassLayout from '../layouts/ClassLayout';
import Stream from '../pages/Stream';
import Classwork from '../pages/Classwork';
import People from '../pages/People';
import Topic from '../pages/classwork/Topic';
import Quiz_assignment from '../pages/classwork/Quiz_assignment';
import ReusePost from '../pages/classwork/ReusePost';
import Question from '../pages/classwork/Question';
import Material from '../pages/classwork/Material';
import Assignment from '../pages/classwork/Assignment';
import ClassWorkLayout from '../layouts/ClassWorkLayout';
import UserForm from '../pages/UserForm';
const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                {/* Main Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/calender" element={<Calander />} />
                <Route path="/teaching" element={<Teaching />} />
                <Route path="/settings" element={<Settings />} />

                {/* Class Routes */}
                <Route path="class/:classId" element={<ClassLayout />}>
                    <Route index element={<Stream />} />
                    <Route path="stream" element={<Stream />} />
                    <Route path="classwork" element={<Classwork />} />
                    <Route path="people" element={<People />} />

                </Route>

            </Route>
            <Route path="class/:classId/classwork/assignment" element={<Assignment />} />
            <Route path="class/:classId/classwork/quiz" element={<Quiz_assignment />} />
            <Route path="class/:classId/classwork/question" element={<Question />} />
            <Route path="class/:classId/classwork/material" element={<Material />} />
            <Route path="class/:classId/classwork/reuse_post" element={<ReusePost />} />
            <Route path="class/:classId/classwork/topic" element={<Topic />} />


            <Route path='signup' element={<UserForm />} />

        </Routes>

    )
}

export default AppRoutes;
