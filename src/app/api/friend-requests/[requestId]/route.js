import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FriendRequest from "@/models/FriendRequest";
import User from "@/models/User";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { requestId } = await params;
    const { action } = await req.json();
    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (request.status !== "pending") {
      return NextResponse.json({ error: "Request already processed" }, { status: 400 });
    }

    if (action === "accept") {
      await Promise.all([
        User.findByIdAndUpdate(request.from, { $addToSet: { friends: request.to } }),
        User.findByIdAndUpdate(request.to, { $addToSet: { friends: request.from } })
      ]);
      await FriendRequest.findByIdAndDelete(requestId);
      
      return NextResponse.json({ 
        success: true, 
        message: "Friend request accepted" 
      }, { status: 200 });

    } else if (action === "reject") {
      await FriendRequest.findByIdAndDelete(requestId);
      
      return NextResponse.json({ 
        success: true, 
        message: "Friend request rejected" 
      }, { status: 200 });

    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

  } catch (err) {
    console.error("Error updating request:", err);
    return NextResponse.json({ 
      error: "Failed to update request",
      details: err.message 
    }, { status: 500 });
  }
}