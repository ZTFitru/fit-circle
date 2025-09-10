import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/UserContext';

export const useWorkouts = () => {
  const { currentUser, refreshUser } = useContext(UserContext);
  const [workouts, setWorkouts] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

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

  const startWorkout = async (workout) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/workouts/${workout._id}/start`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...workout, startedAt: new Date().toISOString() })
      });

      if (response.ok) {
        const updatedWorkout = await response.json();
        setWorkouts(prev =>
          prev.map(w => (w._id === updatedWorkout._id ? updatedWorkout : w))
        );
        setCurrentWorkout(updatedWorkout);
      } else {
        const errorData = await response.text();
        throw new Error(`Failed to start workout: ${response.status} - ${errorData}`);
      }
    } catch (err) {
      console.error('Error starting workout:', err);
      setError('Failed to start workout');
    } finally {
      setLoading(false);
    }
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

      const response = await fetch(`/api/workouts/${currentWorkout._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const updatedWorkout = await response.json();
        setWorkouts(workouts.map(w =>
          w._id === currentWorkout._id ? updatedWorkout : w
        ));
        setCurrentWorkout(null);
        if (refreshUser) {
          await refreshUser();
        }

        router.push('/');
      } else {
        const errorData = await response.text();
        throw new Error(`Failed to complete workout: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Error completing workout:', error);
      setError('Failed to complete workout');
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentWorkout = async (updatedWorkout) => {
    try {
      setError(null);
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
        setWorkouts(workouts.map(w =>
          w._id === savedWorkout._id ? savedWorkout : w
        ));

        if (refreshUser) {
          refreshUser();
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
        setError('You must be logged in to create a workout');
        return;
      }

      if (!bodyPart) {
        setError('Please select a body part');
        return;
      }

      if (!exercises || exercises.length === 0) {
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

      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWorkout),
      });

      if (response.ok) {
        const responseData = await response.json();
        const savedWorkout = responseData.workout || responseData;
        setWorkouts(prevWorkouts => [...prevWorkouts, savedWorkout]);
        setSelectedBodyPart('');

        if (refreshUser) {
          refreshUser();
        }
      } else {
        const errorData = await response.text();
        throw new Error(`Failed to create workout: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Error creating workout:', error);
      setError(`Failed to create workout: ${error.message}`);
    } finally {
      setLoading(false);
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

  const createCustomWorkout = async (customName, customExercises) => {
    if (!customName.trim() || customExercises.length === 0) {
      setError('Custom workout requires a name and at least one exercise');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!currentUser?._id) {
        setError('You must be logged in to create a workout');
        return;
      }

      const newWorkout = {
        userId: currentUser._id,
        name: customName.trim(),
        exercises: customExercises.map(name => ({
          exerciseName: String(name).trim(),
          sets: []
        })),
        completed: false,
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorkout),
      });

      if (response.ok) {
        const responseData = await response.json();
        const savedWorkout = responseData.workout || responseData;

        setWorkouts(prev => [...prev, savedWorkout]);
        setSelectedBodyPart('');

        if (refreshUser) {
          refreshUser();
        }
      } else {
        const errorData = await response.text();
        throw new Error(`Failed to create custom workout: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Error creating custom workout:', error);
      setError(`Failed to create custom workout: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

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
    createCustomWorkout,
    clearError: () => setError(null)
  };
};