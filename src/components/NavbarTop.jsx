import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { LuLogOut } from "react-icons/lu";

const NavbarTop = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Get first two letters of email or empty string if no user/email
  const emailPrefix = user?.email ? user.email.split('@')[0].toUpperCase() : ''
  

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 shadow-2xl px-6 py-3 flex items-center justify-between">
      <h1 className="text-transparent text-xl font-bold bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 drop-shadow-md tracking-wider">
        FlashMaster
      </h1>
      {user && (
        <div className="flex items-center gap-3">
          
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 flex items-center justify-center gap-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
          >
            {emailPrefix}<LuLogOut />
          </button>
        </div>
      )}
    </div>
  )
}

export default NavbarTop