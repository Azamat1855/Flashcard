import React from 'react';

const CardContainer = ({ children, className = '' }) => {
  return (
    <div className={`w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-4 ${className}`}>
      {children}
    </div>
  );
};

export default CardContainer;