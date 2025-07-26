import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { LuLogOut } from "react-icons/lu";

const NavbarTop = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleLogoutClick = () => {
    setIsModalOpen(true)
  }

  const handleConfirmLogout = () => {
    logout()
    setIsModalOpen(false)
    navigate('/login')
  }

  const handleCancelLogout = () => {
    setIsModalOpen(false)
  }

  // Get email prefix before '@' or empty string if no user/email
  const emailPrefix = user?.email ? user.email.split('@')[0].toUpperCase() : ''

  return (
    <>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 shadow-2xl px-6 py-3 flex items-center justify-between">
        <h1 className="text-transparent text-xl font-bold bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 drop-shadow-md tracking-wider">
          FlashMaster
        </h1>
        {user && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogoutClick}
              className="px-4 py-1.5 flex items-center justify-center gap-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
            >
              {emailPrefix}
              <LuLogOut />
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 w-[90%] max-w-sm">
            <h2 className="text-xl font-bold text-white text-center mb-4">Confirm Logout</h2>
            <p className="text-white text-center mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
              >
                Yes, Logout
              </button>
              <button
                onClick={handleCancelLogout}
                className="px-4 py-1.5 bg-gray-500/80 text-white rounded-lg hover:bg-gray-600 transition text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NavbarTop