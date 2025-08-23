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
    } else {
      return NextResponse.json({ error: "Invalid period" }, { status: 400 });
    }

    let allowedIds = [];
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const currentUser = await User.findById(userId).select("friends _id");
      if (currentUser) {
        allowedIds = [currentUser._id, ...(currentUser.friends || [])];
      }
    }
    const matchStage = { date: { $gte: startDate } };
    if (allowedIds.length > 0) {
      matchStage.user = { $in: allowedIds };
    }
    const leaderboard = await Workout.aggregate([
        { $match: matchStage },
        { $unwind: "$exercises" },      
        { $unwind: "$exercises.sets" }, 
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

    const users = await User.find({
      _id: { $in: leaderboard.map(item => item._id) }
    }).select("username avatar");

    const result = leaderboard.map((item) => {
      const user = users.find(u => u._id.toString() === item._id.toString());
      return {
        _id: item._id,
        username: user?.username || "Unknown",
        avatar: user?.avatar || "👤",
        totalWeight: Math.round(item.totalWeight * 100) / 100 
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Leaderboard error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}