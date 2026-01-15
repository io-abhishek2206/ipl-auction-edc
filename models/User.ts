import mongoose from "mongoose"

export interface IUser extends mongoose.Document {
  username: string
  passwordHash: string
  role: "admin" | "team"
  teamId?: string
  createdAt: Date
}

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "team"],
      required: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
  },
  { timestamps: true },
)

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
