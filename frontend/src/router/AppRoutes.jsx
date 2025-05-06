import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Calander from '../pages/Calender';
import Teaching from '../pages/Teaching';
import Settings from '../pages/Settings';
import Layout from '../layouts/SidebarLayout';


const AppRoutes = () => {
    return (
        <div>
            <Routes>
                <Route element={<Layout />}>

                    <Route path="/Home" element={<Home />} />
                    <Route path="/calender" element={<Calander />} />
                    <Route path="/teaching" element={<Teaching />} />
                    <Route path="/settings" element={<Settings />} />

                </Route>
            </Routes>
        </div>
    )
}

export default AppRoutes;

