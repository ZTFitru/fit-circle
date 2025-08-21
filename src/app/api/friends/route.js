import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { userId, friendUsername } = await req.json();

    if (!userId || !friendUsername) {
      return NextResponse.json({ error: "User ID and friend username required" }, { status: 400 });
    }

    // both users
    const user = await User.findById(userId);
    const friend = await User.findOne({ username: friendUsername });

    if (!user || !friend) {
      return NextResponse.json({ error: "User or friend not found" }, { status: 404 });
    }

    // Cant add yourself
    if (user._id.equals(friend._id)) {
      return NextResponse.json({ error: "You cannot add yourself" }, { status: 400 });
    }

    // Wont allow double friends
    if (user.friends.includes(friend._id)) {
      return NextResponse.json({ error: "Friend already added" }, { status: 400 });
    }

    user.friends.push(friend._id);
    await user.save();

    return NextResponse.json({ message: "Friend added successfully", friend }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}