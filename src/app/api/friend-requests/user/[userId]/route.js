import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import FriendRequest from "@/models/FriendRequest";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { userId } = await params;

    const requests = await FriendRequest.find({ 
      to: userId, 
      status: "pending" 
    }).populate("from", "username avatar");

    return NextResponse.json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}