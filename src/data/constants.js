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

export const LEADERBOARD_DATA = [
  { rank: 1, name: 'Mike Johnson', avatar: '👨', value: '18,900 lbs', metric: 'Total Weight' },
  { rank: 2, name: 'Sarah Wilson', avatar: '👩', value: '15,200 lbs', metric: 'Total Weight' },
  { rank: 3, name: 'Alex Chen', avatar: '👤', value: '12,500 lbs', metric: 'Total Weight' },
  { rank: 4, name: 'Emma Davis', avatar: '👩‍🦱', value: '11,800 lbs', metric: 'Total Weight' }
];

export const WORKOUT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

export const METRICS = {
  TOTAL_WEIGHT: 'totalWeight',
  TOTAL_WORKOUTS: 'totalWorkouts',
  BEST_RUN: 'bestRun',
  CONSISTENCY_STREAK: 'consistencyStreak'
};