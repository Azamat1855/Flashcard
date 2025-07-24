import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiActivity, FiList, FiPlusCircle } from 'react-icons/fi'

const Navbar = () => {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  const navItems = [
    { to: '/exercise', icon: <FiActivity size={22} />, key: 'exercise' },
    { to: '/list', icon: <FiList size={22} />, key: 'list' },
    { to: '/create', icon: <FiPlusCircle size={22} />, key: 'create' },
  ]

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md rounded-2xl bg-black/20 backdrop-blur-md border border-white/30 shadow-xl flex justify-around px-4 py-2">
      {navItems.map(({ to, icon, key }) => (
        <Link key={key} to={to}>
          <div
            className={`flex items-center justify-center w-24 h-12 rounded-xl transition-all ${
              isActive(to)
                ? 'bg-white text-black shadow-md'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            {icon}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Navbar
