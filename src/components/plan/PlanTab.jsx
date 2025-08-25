'use client'
import React from 'react';
import BodyPartGrid from './BodyPartGrid';
import WorkoutPreview from './WorkoutPreview';

const PlanTab = ({ 
  selectedBodyPart, 
  setSelectedBodyPart, 
  createWorkout,
  createCustomWorkout,
  loading,
  error
}) => (
  <div>
    <h2 className="text-xl font-bold mb-4 text-black">Plan Your Workout</h2>
    <p className="text-gray-600 mb-4">Choose a body part to focus on:</p>
    
    <BodyPartGrid 
      selectedBodyPart={selectedBodyPart}
      setSelectedBodyPart={setSelectedBodyPart}
    />

    <div className='mt-6'>
      <button 
        className='w-full py-3 rounded-lg bg-purple-500 text-white font-bold hover:bg-purple-600'
        onClick={() => setSelectedBodyPart('custom')}
      >
        Custom Workout
      </button>
    </div>

    <WorkoutPreview 
      selectedBodyPart={selectedBodyPart}
      createWorkout={createWorkout}
      createCustomWorkout={createCustomWorkout}
      loading={loading}
      error={error}
    />
  </div>
);

export default PlanTab;