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


const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<Layout />}>

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


        </Routes>
    )
}

export default AppRoutes;
