import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import NavbarTop from '../components/NavbarTop'
import { AuthContext } from '../context/AuthContext'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#bfd2ff] text-black relative">
      <NavbarTop />
      <div className="px-4 py-16">
        <Outlet />
      </div>
      <Navbar />
    </div>
  )
}

export default MainLayout