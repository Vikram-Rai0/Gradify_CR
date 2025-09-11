// AppRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Calander from "../pages/Calender";
import ClassNav from "../pages/classroom/ClassNav";
import Teaching from "../pages/Teaching";
import Settings from "../pages/Settings";
import Layout from "../layouts/SidebarLayout";
import ClassLayout from "../layouts/ClassLayout";
import Stream from "../pages/Stream";
import Classwork from "../pages/classwork/Classwork";
import People from "../pages/People";
import Topic from "../pages/classwork/Topic";
import Quiz_assignment from "../pages/classwork/Quiz_assignment";
import ReusePost from "../pages/classwork/ReusePost";
import Question from "../pages/classwork/Question";
import Material from "../pages/classwork/Material";
import Assignment from "../pages/classwork/Assignment";
import ClassWorkLayout from "../layouts/ClassWorkLayout";
import UserForm from "../pages/userForm/UserForm";
import HomePage from "../pages/FrontPage";
import ForgotPassword from "../pages/userForm/ForgetPassword";
import CreateClass from "../pages/classroom/CreateClass";
import JoinClass from "../pages/classroom/joinClass";
import GetSinglePageAssignment from "../components/assignment/GetSinglePageAssignment";
import AssignmentUsers from "../components/assignment/StudentWork";
import Dashboard from "../components/dashboard/Admin/Dashboard";
import DLayout from "../layouts/DLayout";
import DNavbar from "../components/dashboard/DNavbar";
import DSidebar from "../components/dashboard/DSidebarL";
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<UserForm />} />
            <Route path="/login" element={<UserForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />


            <Route path="/create-class" element={<CreateClass />} />
            <Route path="/join-class" element={<JoinClass />} />

            <Route element={<Layout />}>

                {/* Main Routes */}
                <Route path="/home" element={<Home />} />
                <Route path="/calender" element={<Calander />} />
                <Route path="/teaching" element={<Teaching />} />
                <Route path="/settings" element={<Settings />} />
                <Route
                    path="/classroom/:classId/assignment/:assignId"
                    element={<GetSinglePageAssignment />}
                />
                <Route
                    path="/classroom/:classId/assignment/:assignId/studentWork"
                    element={<AssignmentUsers />}
                />

                {/* Class Routes */}
                <Route path="classroom/:classId" element={<ClassLayout />}>
                    <Route index element={<Stream />} />
                    <Route path="stream" element={<Stream />} />
                    <Route path="classwork" element={<Classwork />} />
                    <Route path="people" element={<People />} />
                </Route>
            </Route>

            <Route path="/classroom/:classId/classwork" element={<Classwork />} />
            <Route
                path="/classroom/:classId/classwork/assignment"
                element={<Assignment />}
            />
            <Route
                path="/classroom/:classId/classwork/quiz"
                element={<Quiz_assignment />}
            />
            <Route
                path="/classroom/:classId/classwork/question"
                element={<Question />}
            />
            <Route
                path="/classroom/:classId/classwork/material"
                element={<Material />}
            />
            <Route
                path="/classroom/:classId/classwork/reuse_post"
                element={<ReusePost />}
            />
            <Route path="/classroom/:classId/classwork/topic" element={<Topic />} />

            <Route path="dlayout" element={<DLayout />}>
                <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="dpeople" element={< />} />

            </Route>
        </Routes>
    );
};

export default AppRoutes;
