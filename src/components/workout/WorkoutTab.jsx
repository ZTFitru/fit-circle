import React from 'react';
import ActiveWorkout from './ActiveWorkout';
import WorkoutList from './WorkoutList';

const WorkoutTab = ({ 
  currentWorkout, 
  setCurrentWorkout,
  workouts, 
  completeWorkout,
  addExerciseToWorkout,
  showAddExercise,
  setShowAddExercise,
  newExerciseName,
  setNewExerciseName,
  deleteWorkout,
  updateCurrentWorkout,
  startWorkout,
}) => {

  return (
    <div>
    {currentWorkout ? (
      <ActiveWorkout
        currentWorkout={currentWorkout}
        setCurrentWorkout={setCurrentWorkout}
        completeWorkout={completeWorkout}
        addExerciseToWorkout={addExerciseToWorkout}
        showAddExercise={showAddExercise}
        setShowAddExercise={setShowAddExercise}
        newExerciseName={newExerciseName}
        setNewExerciseName={setNewExerciseName}
        updateCurrentWorkout={updateCurrentWorkout}
      />
    ) : (
      <WorkoutList workouts={workouts} startWorkout={startWorkout} deleteWorkout={deleteWorkout} />
    )}
  </div>
  )
  
};

export default WorkoutTab;