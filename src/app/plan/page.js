'use client';
import React, { useContext, useState } from "react";
import Header from "@/components/common/Header";
import BottomNav from "@/components/layout/BottomNav";
import { UserContext } from "@/context/UserContext";
import PlanTab from "@/components/plan/PlanTab";
import { useWorkouts } from "@/hooks/useWorkouts";

const PlanPage = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const workoutHook = useWorkouts()

  const [selectedBodyPart, setSelectedBodyPart] = useState(null)

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("fittracker_user");
    localStorage.removeItem("fittracker_token");
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <PlanTab
          selectedBodyPart={selectedBodyPart}
          setSelectedBodyPart={setSelectedBodyPart}
          createWorkout={workoutHook.createWorkout}
          createCustomWorkout={workoutHook.createCustomWorkout}
          loading={workoutHook.loading}
          error={workoutHook.error}
        />
      </main>
      <BottomNav />
    </div>
  );
};

export default PlanPage;