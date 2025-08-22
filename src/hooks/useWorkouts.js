import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useWorkouts = (currentUser, setCurrentUser) => {
  const [workouts, setWorkouts] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch workouts from MongoDB on component mount
  useEffect(() => {
    fetchWorkouts();
  }, [currentUser?._id]);

  const fetchWorkouts = async () => {
    if (!currentUser?._id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/workouts?userId=${currentUser._id}`);
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data);
      } else {
        throw new Error(`Failed to fetch workouts: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError('Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  const startWorkout = (workout) => {
    setCurrentWorkout(workout);
  };

  const completeWorkout = async () => {
  
  if (!currentWorkout) {
    return;
  }
  
  
  try {
    setLoading(true);
    setError(null);
    
    const requestBody = {
      ...currentWorkout,
      completed: true,
      completedAt: new Date().toISOString()
    };
    
    // Update workout in database
    const response = await fetch(`/api/workouts/${currentWorkout._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const updatedWorkout = await response.json();
      
      // Update local state
      setWorkouts(workouts.map(w => 
        w._id === currentWorkout._id ? updatedWorkout : w
      ));
      setCurrentWorkout(null);

      if (currentUser?._id && setCurrentUser) {
        console.log('🔄 Refreshing current user data...');
        try {
          const userResponse = await fetch(`/api/users/${currentUser._id}`);
          if (userResponse.ok) {
            const updatedUser = await userResponse.json();
            setCurrentUser(updatedUser);
          } else {
            console.error('❌ Failed to refresh user data:', userResponse.status);
          }
        } catch (userError) {
          console.error('❌ Error fetching updated user data:', userError);
        }
      } else {
        console.log('ℹ️ currentUser._id or setCurrentUser not available, skipping user refresh');
      }
      router.push('/');
      
    } else {
      const errorData = await response.text();
      throw new Error(`Failed to complete workout: ${response.status} - ${errorData}`);
    }
  } catch (error) {
    console.error('💥 Error completing workout:', error);
    console.error('💥 Error stack:', error.stack);
    setError('Failed to complete workout');
  } finally {
    setLoading(false);
  }
};

  const updateCurrentWorkout = async (updatedWorkout) => {
    try {
      setError(null);
      // Save to database
      const response = await fetch(`/api/workouts/${updatedWorkout._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedWorkout),
      });

      if (response.ok) {
        const savedWorkout = await response.json();
        setCurrentWorkout(savedWorkout);
        
        // Update local state
        setWorkouts(workouts.map(w => 
          w._id === savedWorkout._id ? savedWorkout : w
        ));

        if (currentUser?._id && setCurrentUser) {
          try {
            const userResponse = await fetch(`/api/users/${currentUser._id}`)
            if (userResponse.ok) {
              const updatedUser = await userResponse.json();
              setCurrentUser(updatedUser);
            } else {
              console.error('❌ Failed to refresh user data:', userResponse.status);
            }
          } catch (userError) {
            console.error('❌ Error fetching updated user data:', userError)
          }
        }
      } else {
        const errorData = await response.text();
        throw new Error(`Failed to update workout: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Error updating workout:', error);
      setError('Failed to update workout');
    }
  };

  const addExerciseToWorkout = async () => {
    if (!newExerciseName.trim() || !currentWorkout) return;

    const updatedWorkout = {
      ...currentWorkout,
      exercises: [
        ...currentWorkout.exercises,
        { 
          exerciseName: newExerciseName.trim(), 
          sets: [] 
        }
      ]
    };

    await updateCurrentWorkout(updatedWorkout);
    setNewExerciseName('');
    setShowAddExercise(false);
  };

  const createWorkout = async (bodyPart, exercises) => {
    
    try {
      setLoading(true);
      setError(null);
      
      if (!currentUser?._id) {
        console.error('No user logged in or no user ID');
        setError('You must be logged in to create a workout');
        return;
      }

      if (!bodyPart) {
        console.error('No body part selected');
        setError('Please select a body part');
        return;
      }

      if (!exercises || exercises.length === 0) {
        console.error('No exercises provided');
        setError('No exercises available for this body part');
        return;
      }
      
      const newWorkout = {
        userId: currentUser._id,
        name: `${bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1)} Day`,
        bodyPart,
        exercises: exercises.slice(0, 3).map(exercise => ({
          exerciseName: typeof exercise === 'string' ? exercise : exercise.exerciseName,
          sets: []
        })),
        completed: false,
        createdAt: new Date().toISOString()
      };

      // console.log('Workout payload:', JSON.stringify(newWorkout, null, 2));

      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWorkout),
      });

      if (response.ok) {
        const responseData = await response.json();
        
        // Handle both response formats
        const savedWorkout = responseData.workout || responseData;
        
        setWorkouts(prevWorkouts => [...prevWorkouts, savedWorkout]);
        setSelectedBodyPart('');

        if (currentUser?._id && setCurrentUser) {
          try {
            const userResponse = await fetch(`/api/users/${currentUser._id}`);
            if (userResponse.ok) {
              const updatedUser = await userResponse.json();
              console.log('🔄 Updated user data:', updatedUser);
              setCurrentUser(updatedUser);
            } else {
              console.error('❌ Failed to refresh user data:', userResponse.status);
            }
          } catch (userError) {
            console.error('❌ Error fetching updated user data:', userError);
          }
        } else {
          console.log('ℹ️ currentUser._id or setCurrentUser not available, skipping user refresh');
        }

      } else {
        const errorData = await response.text();
        console.error('Server error response:', errorData);
        throw new Error(`Failed to create workout: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Error creating workout:', error);
      setError(`Failed to create workout: ${error.message}`);
    } finally {
      setLoading(false);
      console.log('=== END CREATE WORKOUT DEBUG ===');
    }
  }

  const deleteWorkout = async (workoutId) => {
  try {
    setLoading(true);
    setError(null);

    const response = await fetch(`/api/workouts/${workoutId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setWorkouts(prev => prev.filter(w => w._id !== workoutId));
      console.log('Workout deleted successfully');
    } else {
      const errorData = await response.text();
      throw new Error(`Failed to delete workout: ${response.status} - ${errorData}`);
    }
  } catch (error) {
    console.error('Error deleting workout:', error);
    setError('Failed to delete workout');
  } finally {
    setLoading(false);
  }
};

  return {
    workouts,
    currentWorkout,
    selectedBodyPart,
    setSelectedBodyPart,
    showAddExercise,
    setShowAddExercise,
    newExerciseName,
    setNewExerciseName,
    loading,
    error,
    startWorkout,
    completeWorkout,
    addExerciseToWorkout,
    createWorkout,
    updateCurrentWorkout,
    setCurrentWorkout,
    deleteWorkout,
    clearError: () => setError(null)
  };
};