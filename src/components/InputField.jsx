import React from 'react';

const InputField = ({ label, type = 'text', name, value, onChange, placeholder, required = false, isTextarea = false, textColor = 'text-black' }) => {
  const commonClasses = 'w-full rounded-xl px-3 py-1.5 bg-white/80 text-black placeholder-black/50 outline-none focus:ring-2 focus:ring-black/20';
  
  return (
    <div>
      <label className={`text-white text-sm mb-1 block`}>{label}</label>
      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          className={`${commonClasses} resize-none h-20`}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={commonClasses}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
};

export default InputField; 