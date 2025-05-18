import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from '../pages/Home';
import Calander from '../pages/Calender';
import Teaching from '../pages/Teaching';
import Settings from '../pages/Settings';
import Layout from '../layouts/SidebarLayout';
import ClassNav from '../pages/ClassNav';
import Stream from '../pages/Stream';
import ClassLayout from '../layouts/ClassLayout';

const AppRoutes = () => {
    return (
        <div>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/classNav" element={<ClassNav />} />
                    <Route path="/calender" element={<Calander />} />
                    <Route path="/teaching" element={<Teaching />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>



                <Route element={<ClassLayout />}>
                    {/* <Route path="/classNav" element={<ClassNav />} /> */}
                    <Route path="/stream" element={<Stream />} />

                </Route>


            </Routes>
        </div>
    )
}

export default AppRoutes;

