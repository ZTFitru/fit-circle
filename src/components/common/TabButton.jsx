import React from "react";
import Link from "next/link";

const TabButton = ({ href, icon, label, active }) => (
  <Link
    href={href}
    className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
      active
        ? "bg-green-500 text-black"
        : "text-gray-600 hover:bg-gray-200"
    }`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </Link>
);

export default TabButton;