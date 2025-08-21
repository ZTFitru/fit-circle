export const CURRENT_USER = {
  id: 1, 
  name: 'Alex Chen', 
  avatar: '👤',
  totalWorkouts: 24,
  totalWeight: 12500,
  friendsCount: 3
};

export const INITIAL_FRIENDS = [
  { id: 2, name: 'Sarah Wilson', avatar: '👩', totalWeight: 15200, bestRun: '5.2 km' },
  { id: 3, name: 'Mike Johnson', avatar: '👨', totalWeight: 18900, bestRun: '7.8 km' },
  { id: 4, name: 'Emma Davis', avatar: '👩‍🦱', totalWeight: 11800, bestRun: '4.9 km' }
];

export const INITIAL_WORKOUTS = [
  { 
    id: 1, 
    name: 'Push Day', 
    bodyPart: 'chest', 
    exercises: ['Bench Press', 'Push-ups', 'Dips'], 
    completed: true 
  },
  { 
    id: 2, 
    name: 'Pull Day', 
    bodyPart: 'back', 
    exercises: ['Pull-ups', 'Rows', 'Lat Pulldowns'], 
    completed: false 
  }
];

export const BODY_PARTS = [
  { name: 'chest', icon: '💪', color: 'bg-red-500' },
  { name: 'back', icon: '🔄', color: 'bg-blue-500' },
  { name: 'legs', icon: '🦵', color: 'bg-green-500' },
  { name: 'shoulders', icon: '💪', color: 'bg-purple-500' },
  { name: 'arms', icon: '💪', color: 'bg-orange-500' },
  { name: 'core', icon: '⚡', color: 'bg-yellow-500' }
];

export const EXERCISES_BY_BODY_PART = {
  chest: ['Bench Press', 'Push-ups', 'Incline Press', 'Chest Flyes', 'Dips'],
  back: ['Pull-ups', 'Deadlifts', 'Rows', 'Lat Pulldowns', 'T-Bar Rows'],
  legs: ['Squats', 'Lunges', 'Leg Press', 'Calf Raises', 'Leg Curls'],
  shoulders: ['Shoulder Press', 'Lateral Raises', 'Front Raises', 'Rear Delts', 'Shrugs'],
  arms: ['Bicep Curls', 'Tricep Dips', 'Hammer Curls', 'Tricep Extensions', 'Chin-ups'],
  core: ['Planks', 'Crunches', 'Russian Twists', 'Mountain Climbers', 'Dead Bugs']
};

