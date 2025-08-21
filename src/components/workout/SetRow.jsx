'use client'
import React from 'react';
import { X } from 'lucide-react';

const SetRow = ({ setNumber, setData, updateSet, removeSet, canRemove }) => (
  <div className="bg-gray-50 p-3 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-700">Set {setNumber}</span>
      {canRemove && (
        <button
          onClick={() => removeSet(setData.id)}
          className="text-red-500 hover:text-red-700 p-1"
        >
          <X size={14} />
        </button>
      )}
    </div>
    <div className="grid grid-cols-3 gap-3">
      <div className="text-center">
        <label className="text-xs text-gray-500 block mb-1">Reps</label>
        <input
          type="number"
          placeholder="0"
          value={setData.reps}
          onChange={(e) => updateSet(setData.id, 'reps', Number(e.target.value))}
          className="w-full p-2 border rounded text-center"
        />
      </div>
      <div className="text-center">
        <label className="text-xs text-gray-500 block mb-1">Weight (lbs)</label>
        <input
          type="number"
          placeholder="0"
          value={setData.weight}
          onChange={(e) => updateSet(setData.id, 'weight', e.target.value)}
          className="w-full p-2 border rounded text-center"
        />
      </div>
      <div className="text-center">
        <label className="text-xs text-gray-500 block mb-1">Done</label>
        <input
          type="checkbox"
          checked={setData.completed}
          onChange={(e) => updateSet(setData.id, 'completed', e.target.checked)}
          className="w-5 h-5 mt-2 mx-auto"
        />
      </div>
    </div>
  </div>
);

export default SetRow;