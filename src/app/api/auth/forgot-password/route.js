import { connectDB } from "@/lib/mongodb";
import User from '@/models/User';
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer'

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
    try {
        await transporter.sendMail({
            from: `'FITCircle Support' <${process.env.EMAIL_USER}>`,
            to: user.email, 
            subject: 'Password Reset Request',
            html: `
                <p>Hello ${user.username},</p>
                <p>You requested to reset your password. Please click the link below to reset it:</p>
                <a href='${resetUrl}' target='_blank'>${resetUrl}</a>
                <p>This link will expire in 1 hour.</p>           `
        });
        return NextResponse.json({
            message: 'If an account exists, a password reset link has been sent to your email.'
        }, { status: 200})
    } catch (err) {
        console.error('Error sending email:', err)
        return NextResponse.json({ error: 'Failed to send reset email'}, {status: 500})
    }
}

const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})