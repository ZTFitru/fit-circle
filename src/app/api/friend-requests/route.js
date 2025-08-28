import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import FriendRequest from "@/models/FriendRequest";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { fromId, toUsername } = await req.json();

    const toUser = await User.findOne({ username: toUsername });
    if (!toUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (toUser.friends.includes(fromId)) {
      return NextResponse.json({ error: "Already friends" }, { status: 400 });
    }

    const existing = await FriendRequest.findOne({ from: fromId, to: toUser._id, status: "pending" });
    if (existing) {
      return NextResponse.json({ error: "Request already sent" }, { status: 400 });
    }

    const request = await FriendRequest.create({ from: fromId, to: toUser._id });
    return NextResponse.json(request, { status: 201 });

  } catch (err) {
    console.error("Error sending friend request:", err);
    return NextResponse.json({ error: "Failed to send friend request" }, { status: 500 });
  }
}