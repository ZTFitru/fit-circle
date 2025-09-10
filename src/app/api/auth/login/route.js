import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const { username, password } = await req.json();

  const user = await User.findOne({ username });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET || 'default_secret_key',
    { expiresIn: '7d' }
  );

  const res = NextResponse.json({
    message: 'Login successful',
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      friends: user.friends || [],
      totalWorkouts: user.totalWorkouts || 0,
      totalWeight: user.totalWeight || 0,
      badges: user.badges || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  })

  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'strict',
    path: '/'
  })

  return res;
}