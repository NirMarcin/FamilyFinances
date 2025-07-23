import React from 'react';

export default function Button({ children, variant = 'primary', ...props }) {
  const baseClasses = 'px-6 py-3 rounded-md transition duration-300 font-medium';
  
  const variants = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white',
    secondary: 'bg-white border border-orange-500 text-orange-500 hover:bg-orange-100',
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant] || variants.primary}`} {...props}>
      {children}
    </button>
  );
}