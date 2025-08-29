import { connectDB } from "@/lib/mongodb";
import Workout from "@/models/Workout";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const updatedWorkout = await Workout.findByIdAndUpdate(
      id,
      {
        startedAt: new Date(),
        completed: false,
      },
      { new: true }
    );

    if (!updatedWorkout) {
      return new Response(JSON.stringify({ error: "Workout not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedWorkout), { status: 200 });
  } catch (error) {
    console.error("Error starting workout:", error);
    return new Response(JSON.stringify({ error: "Failed to start workout" }), { status: 500 });
  }
}