'use client';
import React, { useContext } from "react";
import LeaderboardTab from "@/components/leaderboard/LeaderboardTab";
import Header from "@/components/common/Header";
import BottomNav from "@/components/layout/BottomNav";
import { UserContext } from "@/context/UserContext";

const LeaderboardPage = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("fittracker_user");
    localStorage.removeItem("fittracker_token");
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto p-4">
        <LeaderboardTab />
      </main>
      <BottomNav />
    </div>
  );
};

export default LeaderboardPage;