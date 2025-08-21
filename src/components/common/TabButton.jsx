import React from 'react';

const TabButton = ({ id, icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
      active 
        ? 'bg-green-500 text-black' 
        : 'text-gray-600 hover:bg-gray-200'
    }`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

export default TabButton;