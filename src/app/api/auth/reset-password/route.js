import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const { token, password } = await req.json();

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default_secret_key'
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }
}