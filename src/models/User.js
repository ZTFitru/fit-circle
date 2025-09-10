import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: null},
  friends:  [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  totalWorkouts: { type: Number, default: 0},
  totalWeight: { type: Number, default: 0},
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  badges: [
    {
      badgeId: Number,
      earned: Boolean,
      earnedDate: Date,
      progress: Number
    }
  ]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
