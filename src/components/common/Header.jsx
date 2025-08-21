"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Settings } from "lucide-react";

const Header = ({ currentUser, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-gray-700 text-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/" passHref>
            <Image src="/fit-logo.png" alt="fit-logo" width={70} height={70} />
          </Link>
        </div>
        <p className="text-blue-100 font-bold">
          Welcome back, {currentUser.username}!
        </p>

        <div className="relative">
          <span 
            onClick={()=> setShowMenu(!showMenu)}
            className="text-2xl hover:bg-white/10 rounded-full p-2 transition-colors cursor-pointer">
            {currentUser.avatar || "👤"}
          </span>
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[150px] z-50">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
                <Settings size={16} />
                Settings
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-around mt-4 bg-white/10 rounded-lg p-3">
        <div className="text-center">
          <div className="font-bold text-lg">{currentUser?.totalWorkouts || 0}</div>
          <div className="text-xs text-blue-100">Workouts</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg">{currentUser?.totalWeight?.toLocaleString?.() || 0}</div>
          <div className="text-xs text-blue-100">lbs Lifted</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg">3</div>
          <div className="text-xs text-blue-100">Friends</div>
        </div>
      </div>


    </div>
  );
};

export default Header;