import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Workout from "@/models/Workout";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "daily";
    const userId = searchParams.get("userId");
    const validPeriods = ['daily', 'weekly', 'monthly'];
    if (!validPeriods.includes(period)) {
      return NextResponse.json({ error: "Invalid period. Must be daily, weekly, or monthly" }, { status: 400 });
    }

    const now = new Date();
    let startDate;

    if (period === "daily") {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (period === "weekly") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "monthly") {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    }

    let allowedIds = [];
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      try {
        const currentUser = await User.findById(userId).select("friends _id");
        if (currentUser) {
          allowedIds = [currentUser._id, ...(currentUser.friends || [])];
        }
      } catch (userErr) {
        console.error('Error fetching user:', userErr);
      }
    }
    const matchStage = { date: { $gte: startDate } };
    if (allowedIds.length > 0) {
      matchStage.user = { $in: allowedIds };
    }
    const leaderboard = await Workout.aggregate([
      { $match: matchStage },
      { $unwind: { path: "$exercises", preserveNullAndEmptyArrays: false } },      
      { $unwind: { path: "$exercises.sets", preserveNullAndEmptyArrays: false } }, 
      {
        $group: {
          _id: "$user",
          totalWeight: {
            $sum: {
              $multiply: [
                { $ifNull: ["$exercises.sets.reps", 0] },
                { $ifNull: ["$exercises.sets.weight", 0] }
              ]
            }
          }
        }
      },
      { $sort: { totalWeight: -1 } },
      { $limit: 20 }
    ]);

    if (leaderboard.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    const userIds = leaderboard.map(item => item._id);
    const users = await User.find({
      _id: { $in: userIds }
    }).select("username avatar");
    const result = leaderboard.map((item) => {
      const user = users.find(u => u._id.toString() === item._id.toString());
      return {
        _id: item._id,
        username: user?.username || "Unknown User",
        avatar: user?.avatar || "👤",
        totalWeight: Math.round(item.totalWeight * 100) / 100 
      };
    });
    return NextResponse.json(result, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (err) {
    console.error("Leaderboard error:", err);
    console.error("Error stack:", err.stack);
    
    return NextResponse.json({ 
      error: "Internal server error",
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }, { status: 500 });
  }
}