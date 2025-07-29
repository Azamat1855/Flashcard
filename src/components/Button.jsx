import React from 'react';

const Button = ({ onClick, children, className = '', type = 'button', variant = 'primary' }) => {
  const baseClasses = 'px-4 py-2 rounded-xl font-semibold transition-all';
  const variantClasses = {
    primary: 'px-4 py-2 bg-indigo-500/80 text-white rounded-xl hover:bg-indigo-600 transition disabled:opacity-50',
    secondary: 'bg-white/20 text-black border border-white/20 hover:bg-white/30',
    danger: 'bg-red-500/80 text-white hover:bg-red-600',
  };

  return (  
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.secondary} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;