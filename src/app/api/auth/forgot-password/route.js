import { connectDB } from "@/lib/mongodb";
import User from '@/models/User';
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();
    const { usernameOrEmail } = await req.json();

    const user = await User.findOne({
        $or: [{ username: usernameOrEmail}, { email: usernameOrEmail}],
    })

    if (!user) {
        return NextResponse.json(
            { message: 'If an account exists, a reset link was sent.'},
            { status: 200}
        )
    }

    const resetToken = jwt.sign(
        { id: user},
        process.env.JWT_SECRET || 'default_secret_key',
        { expiresIn: '1h'}
    )

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;

    return NextResponse.json({
        message: 'Rest link generated',
        resetUrl,
    })
}