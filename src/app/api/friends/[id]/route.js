import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await User.findById(id).populate("friends", "username totalWeight totalWorkouts email");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const friendsWithAvatar = user.friends.map(friend => ({
        ...friend.toObject(),
        avatar: "👤"
    }));

    return NextResponse.json(friendsWithAvatar, { status: 200 });
  } catch (err) {
    console.error("GET friends error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { friendId } = await req.json();

    if (!friendId) {
      return NextResponse.json({ error: "Friend ID is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(friendId)) {
      return NextResponse.json({ error: "Invalid user or friend ID" }, { status: 400 });
    }

    const [user, friend] = await Promise.all([
      User.findById(id),
      User.findById(friendId)
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!friend) {
      return NextResponse.json({ error: "Friend not found" }, { status: 404 });
    }

    if (!user.friends.includes(friendId)) {
      return NextResponse.json({ error: "Users are not friends" }, { status: 400 });
    }

    await Promise.all([
      User.findByIdAndUpdate(id, { $pull: { friends: friendId } }),
      User.findByIdAndUpdate(friendId, { $pull: { friends: id } })
    ]);

    return NextResponse.json({ 
      success: true,
      message: "Friend removed successfully" 
    }, { status: 200 });

  } catch (err) {
    console.error("DELETE friends error:", err);
    return NextResponse.json({ 
      error: "Server error",
      details: err.message 
    }, { status: 500 });
  }
}