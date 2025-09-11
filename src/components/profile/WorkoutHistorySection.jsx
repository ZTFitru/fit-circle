'use client';
import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '@/context/UserContext';

const WorkoutHistorySection = () => {
  const { currentUser } = useContext(UserContext);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all'); 
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const periodOptions = [
    { value: 'week', label: 'Past Week'},
    { value: 'month', label: 'Past Month'},
    { value: 'all', label: 'All Time'}
  ]

  useEffect(() => {
    if (currentUser?._id) {
      fetchWorkoutHistory();
    }
  }, [currentUser?._id]);

  const fetchWorkoutHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/workouts?userId=${currentUser._id}&completed=true`);
      
      if (response.ok) {
        const data = await response.json();
        const sortedWorkouts = data.sort((a, b) => 
          new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt)
        );
        setWorkoutHistory(sortedWorkouts);
      } else {
        throw new Error('Failed to fetch workout history');
      }
    } catch (err) {
      console.error('Error fetching workout history:', err);
      setError('Failed to load workout history');
    } finally {
      setLoading(false);
    }
  };

  const filterWorkoutsByPeriod = (workouts) => {
    if (selectedPeriod === 'all') return workouts;
    
    const now = new Date();
    const filterDate = new Date();
    
    if (selectedPeriod === 'week') {
      filterDate.setDate(now.getDate() - 7);
    } else if (selectedPeriod === 'month') {
      filterDate.setMonth(now.getMonth() - 1);
    }
    
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.startedAt || workout.date);
      return workoutDate >= filterDate;
    });
  };

  const calculateWorkoutStats = (workout) => {
    let totalSets = 0;
    let totalReps = 0;
    let totalWeight = 0;
    let exerciseCount = workout.exercises?.length || 0;

    workout.exercises?.forEach(exercise => {
      if (exercise.sets) {
        totalSets += exercise.sets.length;
        exercise.sets.forEach(set => {
          totalReps += parseInt(set.reps) || 0;
          totalWeight += (parseInt(set.reps) || 0) * (parseFloat(set.weight) || 0);
        });
      }
    });

    return { totalSets, totalReps, totalWeight, exerciseCount };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) return 'N/A';
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const toggleWorkoutExpansion = (workoutId) => {
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
  };

  if (!currentUser) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border p-4 text-center">
        <div className="text-gray-500">Please log in to view workout history.</div>
      </div>
    );
  }

  const handlePeriodChange = (value)=> {
    setSelectedPeriod(value)
    setShowPeriodDropdown(false)
  }

  const filteredWorkouts = filterWorkoutsByPeriod(workoutHistory);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-4 space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Workout History ({filteredWorkouts.length})
          </h3>
          <div className="relative">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="flex items-center justify-between text-sm border border-gray-300 rounded-md px-3 py-2 bg-white hover:bg-gray-50 min-w-[120px]"
            >
              <span>{periodOptions.find(option => option.value === selectedPeriod)?.label}</span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${showPeriodDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showPeriodDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowPeriodDropdown(false)}
                />
                
                <div className="absolute right-0 top-full mt-1 w-full min-w-[120px] bg-white border border-gray-300 rounded-md shadow-lg z-20">
                  {periodOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handlePeriodChange(option.value)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md ${
                        selectedPeriod === option.value ? 'bg-green-50 text-green-600' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading workout history...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <div className="text-red-500 text-sm">{error}</div>
            <button
              onClick={fetchWorkoutHistory}
              className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredWorkouts.length > 0 ? (
              <div className="space-y-3">
                {filteredWorkouts.map((workout) => {
                  const stats = calculateWorkoutStats(workout);
                  const isExpanded = expandedWorkout === workout._id;
                  
                  return (
                    <div
                      key={workout._id}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => toggleWorkoutExpansion(workout._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-800 text-sm">
                                {workout.name || 'Untitled Workout'}
                              </h4>
                              {workout.bodyPart && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  {workout.bodyPart}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                              <span>
                                📅 {formatDate(workout.startedAt || workout.date)}
                              </span>
                              <span>💪 {stats.exerciseCount} exercises</span>
                            </div>
                          </div>
                          <div className="text-right text-xs text-gray-500">
                            <div>{stats.totalSets} sets</div>
                            <div>{stats.totalWeight.toLocaleString()} lbs total</div>
                          </div>
                          <div className="ml-2">
                            <svg
                              className={`w-4 h-4 text-gray-400 transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="space-y-3">
                            {workout.exercises && workout.exercises.length > 0 ? (
                              workout.exercises.map((exercise, exerciseIndex) => (
                                <div key={exerciseIndex} className="bg-gray-50 rounded-md p-3">
                                  <h5 className="font-medium text-gray-800 text-sm mb-2">
                                    {exercise.exerciseName}
                                  </h5>
                                  {exercise.sets && exercise.sets.length > 0 ? (
                                    <div className="space-y-1">
                                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 font-medium">
                                        <span>Set</span>
                                        <span>Weight</span>
                                        <span>Reps</span>
                                      </div>
                                      {exercise.sets.map((set, setIndex) => (
                                        <div key={setIndex} className="grid grid-cols-3 gap-2 text-xs">
                                          <span className="text-gray-600">{setIndex + 1}</span>
                                          <span className="text-gray-800">{set.weight || 0} lbs</span>
                                          <span className="text-gray-800">{set.reps || 0}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-xs text-gray-500">No sets recorded</div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-gray-500">No exercises recorded</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">💪</div>
                <p className="text-gray-500 mb-2">
                  {selectedPeriod === 'all' 
                    ? "No completed workouts yet." 
                    : `No workouts completed in the past ${selectedPeriod}.`
                  }
                </p>
                <p className="text-sm text-gray-400">
                  Complete your first workout to see it here!
                </p>
              </div>
            )}
          </>
        )}

        {!loading && !error && filteredWorkouts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {selectedPeriod === 'all' ? 'All Time Stats' : 
               selectedPeriod === 'week' ? 'This Week' : 'This Month'}
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 rounded-lg p-2">
                <div className="text-lg font-bold text-green-600">
                  {filteredWorkouts.length}
                </div>
                <div className="text-xs text-gray-600">Workouts</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2">
                <div className="text-lg font-bold text-blue-600">
                  {filteredWorkouts.reduce((total, workout) => 
                    total + calculateWorkoutStats(workout).totalSets, 0
                  )}
                </div>
                <div className="text-xs text-gray-600">Total Sets</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-2">
                <div className="text-lg font-bold text-purple-600">
                  {filteredWorkouts.reduce((total, workout) => 
                    total + calculateWorkoutStats(workout).totalWeight, 0
                  ).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Lbs Lifted</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutHistorySection;