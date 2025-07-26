import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import NavbarTop from '../components/NavbarTop';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#bfd2ff] text-black relative">
      <NavbarTop />
      <div className="px-4 py-16">
        <Outlet />
      </div>
      <Navbar />
    </div>
  );
};

export default MainLayout;