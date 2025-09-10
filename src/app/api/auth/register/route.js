import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { availableBadges } from "@/data/badges";

export async function POST(req) {
  try {
    await connectDB();
    const { username, email, password } = await req.json();

    const existing = await User.findOne({ username });
    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      badges: availableBadges.map(b => ({
        badgeId: b.id,
        earned: false,
        earnedDate: null,
        progress: 0
      }))
    });

    await newUser.save();

    return NextResponse.json({
      message: 'user registered',
      user: { _id: newUser._id, username: newUser.username, email: newUser.email }
    }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
