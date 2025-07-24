import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import NavbarTop from '../components/NavbarTop'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#bfd2ff] text-black relative">
      <NavbarTop />
      <div className="pt-20 pb-24 px-4"> {/* spacing for top & bottom nav */}
        <Outlet />
      </div>
      <Navbar />
    </div>
  )
}

export default MainLayout
