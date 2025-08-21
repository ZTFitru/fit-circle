import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Workout from "@/models/Workout";

// GET workouts for a specific user
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const workouts = await Workout.find({ user: userId });
    return NextResponse.json(workouts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new workout
export async function POST(req) {
  try {
    await connectDB();
    const { userId, name, bodyPart, exercises, completed, createdAt } = await req.json();

    if (!userId || !name || !exercises) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const workout = new Workout({
      user: userId, 
      name,
      bodyPart,
      exercises,
      completed: completed || false,
      createdAt: createdAt || new Date().toISOString()
    });

    await workout.save();

    return NextResponse.json(
      { message: "Workout created", workout },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating workout:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}