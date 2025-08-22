'use client'

import React from 'react';

const AddExerciseForm = ({ 
  showAddExercise, 
  setShowAddExercise, 
  newExerciseName, 
  setNewExerciseName, 
  addExerciseToWorkout 
}) => {
  if (!showAddExercise) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <input
        type="text"
        placeholder="Enter exercise name"
        value={newExerciseName}
        onChange={(e) => setNewExerciseName(e.target.value)}
        className="w-full p-2 border rounded-lg mb-2 text-black"
      />
      <div className="flex gap-2">
        <button
          onClick={()=> addExerciseToWorkout(newExerciseName)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm"
        >
          Add Exercise
        </button>
        <button
          onClick={() => setShowAddExercise(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddExerciseForm;