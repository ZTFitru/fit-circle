import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  exercises: [
    {
      exerciseName: String,
      sets: [
        {
          reps: Number,
          weight: Number,
          completed: { type: Boolean, default: false },
          completedAt: { type: Date},
          date: { type: Date, default: Date.now}
        }
      ]
    }
  ],
  date: { type: Date, default: Date.now }
});

export default mongoose.models.Workout || mongoose.model("Workout", WorkoutSchema);