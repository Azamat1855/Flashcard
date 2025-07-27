import React from 'react';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-sm w-full text-white">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        {children}
        <div className="flex justify-end space-x-4 mt-6">
          {footer}
        </div>
      </div>
    </div>
  );
};

export default Modal;