import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const user = await User.findById(id).populate("friends", "username totalWeight totalWorkouts email");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const friendsWithAvatar = user.friends.map(friend => ({
        ...friend.toObject(),
        avatar: "👤"
    }))

    return NextResponse.json(user.friends, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { friendId } = await req.json();

    if (!friendId) {
      return NextResponse.json({ error: "Friend ID is required" }, { status: 400 });
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // removes the friend from the friend list
    user.friends = user.friends.filter(fid => fid.toString() !== friendId);
    await user.save();

    return NextResponse.json({ message: "Friend removed successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}