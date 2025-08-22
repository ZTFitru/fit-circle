
'use client'
import React, { useState } from 'react';
import SetRow from './SetRow';
import { Trash2, PlusCircle } from 'lucide-react';

const ExerciseCard = ({ exercise, index, removeExercise, updateExercise }) => {
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')

  const addSet = () => {
    if (!reps || !weight) return;
    const newSet = { reps: parseInt(reps), weight: parseInt(weight)}
    const updatedSet = [ ...exercise.sets, newSet];
    updateExercise(index, updatedSet);
    setReps('');
    setWeight('');
  }

  const deleteSet = (setIndex) => {
  const updatedSets = exercise.sets.filter((_, i) => i !== setIndex);
  updateExercise(index, updatedSets);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">{exercise.exerciseName}</h3>
        <button onClick={() => removeExercise(index)} className="text-red-500">
          <Trash2 size={18} />
        </button>
      </div>

      <ul className="space-y-2">
        {exercise.sets.map((set, i) => (
          <li key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded">
            <span>{set.reps} reps × {set.weight} lbs</span>
            <button onClick={() => deleteSet(i)} className="text-red-400 hover:text-red-600">
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
        <div className="flex items-center gap-2 mt-3">
          <input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="border p-1 rounded w-20 text-black"
          />
          <input
            type="number"
            placeholder="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="border p-1 rounded w-24 text-black"
          />
          <div>
            <button
              onClick={addSet}
              className="bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1"
            >
              + Add Set
            </button>

          </div>
        </div>
    </div>
  );
};

export default ExerciseCard;