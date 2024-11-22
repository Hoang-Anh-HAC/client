// src/layouts/MainLayout.js
import React from "react";
import Navbar from "../components/user/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/user/FooterLayout";

function MainLayout() {
  console.log("MainLayout rendered");

  return (
    <div className="w-full bg-secondary overflow-x-hidden">
      <Navbar />
      <div className="w-full">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;
