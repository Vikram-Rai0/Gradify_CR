import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from '../pages/Home';
import Calander from '../pages/Calender';
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
import CreateMenu from '../pages/Classwork';
import ClassWorkLayout from '../layouts/ClassWorkLayout';




const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                {/* <Route>

            </Route> */}

                <Route path="/" element={<Home />} />
                <Route path="/calender" element={<Calander />} />
                <Route path="/teaching" element={<Teaching />} />
                <Route path="/settings" element={<Settings />} />

                <Route path="/classNav" element={<ClassLayout />}>

                    <Route index element={<Stream />} /> {/* Default route */}
                    <Route path="stream" element={<Stream />} />
                    <Route path="/classNav/classwork" element={<Classwork />} />
                    <Route path="/classNav/people" element={<People />} />
                </Route>
            </Route>

            <Route element={<ClassWorkLayout />}>
                <Route path="assignment" element={<Assignment />} />
                <Route path="quiz" element={<Quiz_assignment />} />
                <Route path="question" element={<Question />} />
                <Route path="/material" element={<Material />} />
                <Route path="reuse_post" element={<ReusePost />} />
                <Route path="topic" element={<Topic />} />

            </Route>
        </Routes>
    )
}

export default AppRoutes;
