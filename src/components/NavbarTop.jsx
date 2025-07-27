import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LuLogOut } from 'react-icons/lu';
import { logout } from '../redux/authSlice';
import Modal from '../components/Modal';
import Button from '../components/Button';

const NavbarTop = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmLogout = () => {
    dispatch(logout());
    setIsModalOpen(false);
    navigate('/login');
  };

  const handleCancelLogout = () => {
    setIsModalOpen(false);
  };

  const emailPrefix = user?.email ? user.email.split('@')[0].toUpperCase() : '';

  return (
    <>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 shadow-2xl px-6 py-3 flex items-center justify-between">
        <h1 className="text-transparent text-xl font-bold bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 drop-shadow-md tracking-wider">
          FlashMaster
        </h1>
        {user && (
          <div className="flex items-center gap-3">
            <Button
              onClick={handleLogoutClick}
              variant="danger"
              className="flex items-center justify-center gap-2 text-sm font-medium"
            >
              {emailPrefix}
              <LuLogOut />
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelLogout}
        title="Confirm Logout"
        footer={
          <>
            <Button onClick={handleCancelLogout} variant="secondary" className="text-sm font-medium">
              Cancel
            </Button>
            <Button onClick={handleConfirmLogout} variant="danger" className="text-sm font-medium">
              Yes, Logout
            </Button>
          </>
        }
      >
        <p className="text-sm mb-6 text-white text-center">
          Are you sure you want to log out?
        </p>
      </Modal>
    </>
  );
};

export default NavbarTop;