"use client";
import React from "react";
import { Play, Check, Trash2 } from "lucide-react";

const WorkoutList = ({ workouts, startWorkout, deleteWorkout }) => (
  <div className="flex flex-col h-full">
    <h2 className="text-xl font-bold mb-4 text-black">My Workouts</h2>
    <div className="flex-1 space-y-3 overflow-y-auto pb-20">
      {workouts.map((workout, index) => (
        <div
          key={workout._id || `workout-${index}`}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-black">{workout.name}</h3>
              <p className="text-sm text-gray-500">
                {workout.exercises?.length || 0} exercises •{" "}
                {workout.bodyPart || "N/A"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {workout.completed && (
                <Check className="text-green-500" size={16} />
              )}
              <button
                onClick={() => startWorkout(workout)}
                className="bg-green-600 text-white p-2 rounded-lg"
              >
                <Play size={16} />
              </button>
              <button
                onClick={() => deleteWorkout(workout._id)}
                className="bg-red-600 text-white p-2 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WorkoutList;
