'use client'
import React from "react";
import WorkoutList from "@/components/workout/WorkoutList";
import { useWorkouts } from "@/hooks/useWorkouts";

const WorkoutsPage = () => {
  const { workouts, startWorkout, deleteWorkout } = useWorkouts();

  return (
    <div className="p-4">
      <WorkoutList
        workouts={workouts}
        startWorkout={startWorkout}
        deleteWorkout={deleteWorkout}
      />
    </div>
  );
};

export default WorkoutsPage;