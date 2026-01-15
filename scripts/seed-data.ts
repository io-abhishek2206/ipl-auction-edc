import mongoose from "mongoose"
import { User } from "../models/User"
import { Team } from "../models/Team"
import { Player } from "../models/Player"
import { hashPassword } from "../lib/auth"

const MONGODB_URI = process.env.MONGODB_URI || ""

const teams = [
  "Mumbai Indians",
  "Chennai Super Kings",
  "Kolkata Knight Riders",
  "Delhi Capitals",
  "Rajasthan Royals",
  "Sunrisers Hyderabad",
  "Kings XI Punjab",
  "Royal Challengers Bangalore",
  "Lucknow Super Giants",
  "Gujarat Titans",
  "Multan Sultans",
  "Lahore Qalandars",
]

const players = [
  { name: "Virat Kohli", role: "batsman", basePrice: 100000 },
  { name: "Rohit Sharma", role: "batsman", basePrice: 120000 },
  { name: "MS Dhoni", role: "batsman", basePrice: 80000 },
  { name: "Jasprit Bumrah", role: "bowler", basePrice: 110000 },
  { name: "Yuzvendra Chahal", role: "bowler", basePrice: 75000 },
  { name: "Suresh Raina", role: "all-rounder", basePrice: 70000 },
  { name: "Hardik Pandya", role: "all-rounder", basePrice: 105000 },
  { name: "Ravichandran Ashwin", role: "all-rounder", basePrice: 85000 },
  { name: "KL Rahul", role: "batsman", basePrice: 95000 },
  { name: "Rishabh Pant", role: "all-rounder", basePrice: 115000 },
  { name: "Ishan Kishan", role: "batsman", basePrice: 65000 },
  { name: "Shreyas Iyer", role: "batsman", basePrice: 90000 },
]

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Team.deleteMany({})
    await Player.deleteMany({})

    // Create admin user
    const adminPasswordHash = await hashPassword("admin@123")
    await User.create({
      username: "admin",
      passwordHash: adminPasswordHash,
      role: "admin",
    })

    // Create teams and team users
    const createdTeams = []
    for (const teamName of teams) {
      const team = await Team.create({
        name: teamName,
        balance: 1000000,
        points: 0,
      })
      createdTeams.push(team)

      const teamUserPassword = await hashPassword("team@123")
      await User.create({
        username: teamName.toLowerCase().replace(/\s+/g, ""),
        passwordHash: teamUserPassword,
        role: "team",
        teamId: team._id,
      })
    }

    // Create players
    for (const playerData of players) {
      await Player.create(playerData)
    }

    console.log("Seed data created successfully!")
    console.log(`Created ${createdTeams.length} teams`)
    console.log(`Created ${players.length} players`)
    console.log("Admin user: admin / admin@123")
    console.log("Team users: [teamname] / team@123")
  } catch (error) {
    console.error("Error seeding data:", error)
  } finally {
    await mongoose.disconnect()
  }
}

seedData()
