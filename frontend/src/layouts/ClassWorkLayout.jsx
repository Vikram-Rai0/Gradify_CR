// layouts/ClassWorkLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

const ClassWorkLayout = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Classwork Section</h1>
      <Outlet />
    </div>
  );
};

export default ClassWorkLayout;
