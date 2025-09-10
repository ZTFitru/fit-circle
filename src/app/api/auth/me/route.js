import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log('Found user:', {
      id: user._id,
      email: user.email,
      profileImage: user.profileImage
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("Error in /api/auth/me:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}