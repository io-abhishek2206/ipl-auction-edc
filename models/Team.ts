import mongoose from "mongoose"

export interface ITeam extends mongoose.Document {
  name: string
  balance: number
  points: number
  playersBought: mongoose.Types.ObjectId[]
  createdAt: Date
}

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 1000000, // 10 lakh base amount
    },
    points: {
      type: Number,
      required: true,
      default: 0,
    },
    playersBought: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
  },
  { timestamps: true },
)

export const Team = mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema)
