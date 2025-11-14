import bcrypt from "bcryptjs"
import User from "../models/User";
import { generateToken } from "../utils/generateToken"; 


export const authService = {
  async register(email: string, password: string, name: string) {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error("User already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
      email,
      password: hashedPassword,
      name,
    })

    await user.save()

    const token = generateToken(user._id.toString())
    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    }
  },

  async login(email: string, password: string) {
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error("User not found")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error("Invalid password")
    }

    const token = generateToken(user._id.toString())
    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    }
  },

  async getCurrentUser(userId: string) {
    const user = await User.findById(userId).select("-password")
    if (!user) {
      throw new Error("User not found")
    }
    return user
  },
}
