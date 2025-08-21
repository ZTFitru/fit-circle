
"use client";

import React from "react";
import { Target, Plus, Check } from "lucide-react";
import ExerciseCard from "./ExerciseCard";
import AddExerciseForm from "./AddExerciseForm";

const ActiveWorkout = ({
  currentWorkout,
  setCurrentWorkout,
  completeWorkout,
  showAddExercise,
  setShowAddExercise,
  newExerciseName,
  setNewExerciseName,
  updateCurrentWorkout,
}) => {

  const addExerciseToWorkout = (exerciseName) => {
    if (!exerciseName.trim()) return;
    const updatedExercises = [
      ...currentWorkout.exercises,
      { exerciseName, sets: []}
    ]
    setCurrentWorkout({ ...currentWorkout, exercises: updatedExercises})
    setNewExerciseName('')
    setShowAddExercise(false)
  }

  const removeExercise = (exerciseIndex) => {
    const updatedExercises = currentWorkout.exercises.filter((_, i) => i !== exerciseIndex)
    setCurrentWorkout({ ...currentWorkout, exercises: updatedExercises})
  }

  const updateExercise = (exerciseIndex, updatedSets) => {
  const updatedExercises = [...currentWorkout.exercises];
  updatedExercises[exerciseIndex] = {
    ...updatedExercises[exerciseIndex],
    sets: updatedSets,
  };
  const updatedWorkout = { ...currentWorkout, exercises: updatedExercises}

  setCurrentWorkout(updatedWorkout);
  updateCurrentWorkout(updatedWorkout);
  };

  const handleCompleteWorkout = () => {
    
    if (!completeWorkout) {
      return;
    }
    
    if (typeof completeWorkout !== 'function') {
      return;
    }
    completeWorkout();
  };

  return (
    <div>
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-blue-800">Current Workout</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddExercise(true)}
              className="bg-blue-500 text-white p-1 rounded"
            >
              <Plus size={16} />
            </button>
            <Target className="text-blue-600" size={24} />
          </div>
        </div>
        <p className="text-blue-600 font-medium">{currentWorkout.name}</p>
      </div>

      <AddExerciseForm
        showAddExercise={showAddExercise}
        setShowAddExercise={setShowAddExercise}
        newExerciseName={newExerciseName}
        setNewExerciseName={setNewExerciseName}
        addExerciseToWorkout={addExerciseToWorkout}
      />

      <div className="space-y-4">
        {currentWorkout.exercises.map((exercise, index) => (
          <ExerciseCard 
            key={index} 
            exercise={exercise} 
            index={index} 
            removeExercise={removeExercise}
            updateExercise={updateExercise}
          />
        ))}
      </div>

      <button
        onClick={handleCompleteWorkout}
        className="w-full bg-green-500 text-white py-3 rounded-lg font-bold mt-6 flex items-center justify-center gap-2"
      >
        <Check size={20} />
        Complete Workout
      </button>
    </div>
  )
}

export default ActiveWorkout;