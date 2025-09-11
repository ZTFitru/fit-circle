import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { availableBadges } from "@/data/badges";
import jwt from "jsonwebtoken";

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

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      message: "User registered",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profileImage: newUser.profileImage,
        friends: newUser.friends || [],
        totalWorkouts: newUser.totalWorkouts || 0,
        totalWeight: newUser.totalWeight || 0,
        badges: newUser.badges || [],
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      }
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
      path: "/",
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}