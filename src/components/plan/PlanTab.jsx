'use client'
import React from 'react';
import BodyPartGrid from './BodyPartGrid';
import WorkoutPreview from './WorkoutPreview';

const PlanTab = ({ 
  selectedBodyPart, 
  setSelectedBodyPart, 
  createWorkout 
}) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Plan Your Workout</h2>
    <p className="text-gray-600 mb-4">Choose a body part to focus on:</p>
    
    <BodyPartGrid 
      selectedBodyPart={selectedBodyPart}
      setSelectedBodyPart={setSelectedBodyPart}
    />

    <WorkoutPreview 
      selectedBodyPart={selectedBodyPart}
      createWorkout={createWorkout}
    />
  </div>
);

export default PlanTab;