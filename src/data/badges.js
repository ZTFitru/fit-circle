export const availableBadges = [
    {
        id: 1,
        name: 'First Workout',
        description: 'Complete your first workout',
        image: '/images/badges/first-workout.png',
        earned: false,
        earnedDate: null,
        progress: 0,
        target: 1,
        type: 'workouts',
        condition: ({ totalWorkouts}) => totalWorkouts >= 1
    },
    {
        id: 2,
        name: '1000 lbs club',
        description: 'Accumulate 1000 lbs total weight',
        image: '/images/badges/1000lbsClub.png',
        earned: false,
        earnedDate: null,
        progress: 0,
        target: 1000,
        type: 'weight',
        condition: ({totalWeight})=> totalWeight >= 1000
    },
    {
        id: 3,
        name: '10,000 lbs club',
        description: 'Accumulate 10,000 lbs total weight',
        image: '/images/badges/10000lbsClub.png',
        earned: false,
        earnedDate: null,
        progress: 0,
        target: 10000,
        type: 'weight',
        condition: ({totalWeight})=> totalWeight >= 10000
    },
    {
        id: 4,
        name: '50,000 lbs club',
        description: 'Accumulate 50,000 lbs total weight',
        image: '/images/badges/50000lbsClub.png',
        earned: false,
        earnedDate: null,
        progress: 0,
        target: 50000,
        type: 'weight',
        condition: ({totalWeight})=> totalWeight >= 50000
    },
    {
        id: 5,
        name: '100,000 lbs club',
        description: 'Accumulate 100,000 lbs total weight',
        image: '/images/badges/100000lbsClub.png',
        earned: false,
        earnedDate: null,
        progress: 0,
        target: 100000,
        type: 'weight',
        condition: ({totalWeight})=> totalWeight >= 100000
    },
    {
        id: 6,
        name: '500,000 lbs club',
        description: 'Accumulate 500,000 lbs total weight',
        image: '/images/badges/500000lbsClub.png',
        earned: false,
        earnedDate: null,
        progress: 0,
        target: 500000,
        type: 'weight',
        condition: ({totalWeight})=> totalWeight >= 500000
    },
    {
        id: 7,
        name: '1,000,000 lbs club',
        description: 'Accumulate 1,000,000 lbs total weight',
        image: '/images/badges/1000000lbsClub.png',
        earned: false,
        earnedDate: null,
        progress: 0,
        target: 1000000,
        type: 'weight',
        condition: ({totalWeight})=> totalWeight >= 1000000
    }
]