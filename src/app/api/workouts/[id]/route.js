import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Workout from "@/models/Workout";
import User from "@/models/User";

export async function GET(req, context) {
  try {
    await connectDB();
    const { id } = await context.params
    const workout = await Workout.findById(id).populate("user", "username email");
    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }
    return NextResponse.json(workout, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    await connectDB();
    const { id } = await context.params
    const body = await req.json();

    const workout = await Workout.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    if (body.completed) {
      const totalWeight = workout.exercises.reduce(
        (sum, ex) => sum + ex.sets.reduce((s, set) => s + (set.weight * set.reps), 0),
        0
      );

      await User.findByIdAndUpdate(workout.user, {
        $inc: {
          totalWorkouts: 1,
          totalWeight: totalWeight
        }
      });
    }

    return NextResponse.json(workout, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await connectDB();
    const { id } = await context.params
    const workout = await Workout.findByIdAndDelete(id);
    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Workout deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}