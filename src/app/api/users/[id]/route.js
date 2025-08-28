import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await User.findById(id).select("username email totalWorkouts totalWeight friends");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      totalWorkouts: user.totalWorkouts || 0,
      totalWeight: user.totalWeight || 0,
      friends: user.friends || [],
    };

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("GET user error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}