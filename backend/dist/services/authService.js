"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
exports.authService = {
    async register(email, password, name) {
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.User({
            email,
            password: hashedPassword,
            name,
        });
        await user.save();
        const token = (0, auth_1.generateToken)(user._id.toString());
        return {
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        };
    },
    async login(email, password) {
        const user = await User_1.User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        const token = (0, auth_1.generateToken)(user._id.toString());
        return {
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        };
    },
    async getCurrentUser(userId) {
        const user = await User_1.User.findById(userId).select("-password");
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    },
};
