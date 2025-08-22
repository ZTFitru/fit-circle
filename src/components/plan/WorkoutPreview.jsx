'use client'
import React from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { EXERCISES_BY_BODY_PART } from '../../data/constants';

const WorkoutPreview = ({ selectedBodyPart, createWorkout, loading, error }) => {
  
  if (!selectedBodyPart) return null;

  const exercises = EXERCISES_BY_BODY_PART[selectedBodyPart] || [];

  const handleCreateWorkout = async () => {
    // console.log('Create workout button clicked');
    // console.log('Selected body part:', selectedBodyPart);
    // console.log('Available exercises:', exercises);
    
    if (exercises.length === 0) {
      // console.error('No exercises available for', selectedBodyPart);
      return;
    }
    
    try {
      await createWorkout(selectedBodyPart, exercises);
    } catch (error) {
      console.error('Error in handleCreateWorkout:', error);
    }
  };

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
      <h3 className="font-bold mb-3 capitalize">{selectedBodyPart} Exercises:</h3>
      
      {exercises.length === 0 ? (
        <div className="flex items-center gap-2 text-amber-600 mb-4">
          <AlertCircle size={16} />
          <span className="text-sm">No exercises found for {selectedBodyPart}</span>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {exercises.slice(0, 3).map((exercise, index) => (
            <div key={index} className="bg-white p-2 rounded text-sm">
              {typeof exercise === 'string' ? exercise : exercise.exerciseName || 'Unknown Exercise'}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 mb-4 p-2 bg-red-50 rounded">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <button
        onClick={handleCreateWorkout}
        disabled={loading || exercises.length === 0}
        className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
          loading || exercises.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Creating...
          </>
        ) : (
          <>
            <Plus size={16} />
            Create Workout
          </>
        )}
      </button>
    </div>
  );
};

export default WorkoutPreview;