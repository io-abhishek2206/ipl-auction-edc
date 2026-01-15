import mongoose from "mongoose"

export interface IPlayer extends mongoose.Document {
  name: string
  role: "batsman" | "bowler" | "all-rounder"
  basePrice: number
  soldPrice?: number
  soldToTeamId?: mongoose.Types.ObjectId
  status: "unsold" | "sold"
  createdAt: Date
}

const PlayerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["batsman", "bowler", "all-rounder"],
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    soldPrice: {
      type: Number,
      default: null,
    },
    soldToTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    status: {
      type: String,
      enum: ["unsold", "sold"],
      default: "unsold",
    },
  },
  { timestamps: true },
)

export const Player = mongoose.models.Player || mongoose.model<IPlayer>("Player", PlayerSchema)
