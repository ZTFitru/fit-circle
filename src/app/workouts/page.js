'use client'
import React, { useContext } from "react";
import WorkoutTab from "@/components/workout/WorkoutTab";
import { useWorkouts } from "@/hooks/useWorkouts";
import Header from "@/components/common/Header";
import BottomNav from "@/components/layout/BottomNav";
import { UserContext } from "@/context/UserContext";

const WorkoutsPage = () => {
  const {
    workouts,
    currentWorkout,
    setCurrentWorkout,
    completeWorkout,
    addExerciseToWorkout,
    showAddExercise,
    setShowAddExercise,
    newExerciseName,
    setNewExerciseName,
    deleteWorkout,
    updateCurrentWorkout,
    startWorkout,
  } = useWorkouts();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fittracker_user');
    localStorage.removeItem('fittracker_token');
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto p-4">
        <WorkoutTab 
          workouts={workouts}
          currentWorkout={currentWorkout}
          setCurrentWorkout={setCurrentWorkout}
          completeWorkout={completeWorkout}
          addExerciseToWorkout={addExerciseToWorkout}
          showAddExercise={showAddExercise}
          setShowAddExercise={setShowAddExercise}
          newExerciseName={newExerciseName}
          setNewExerciseName={setNewExerciseName}
          deleteWorkout={deleteWorkout}
          updateCurrentWorkout={updateCurrentWorkout}
          startWorkout={startWorkout}
        />
      </main>
      <BottomNav />
    </div>
  );
};

export default WorkoutsPage;