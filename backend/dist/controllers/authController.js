"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: "All fields are required.",
            });
        }
        const exists = await User_1.default.findOne({ email });
        if (exists) {
            return res.status(400).json({
                success: false,
                error: "Email already exists.",
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.default.create({
            name,
            email,
            password: hashedPassword,
        });
        const token = jsonwebtoken_1.default.sign({ userId: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.json({
            success: true,
            token,
            user: {
                id: user._id, // 🔥 THIS IS THE FIX
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            success: false,
            error: "Server error",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ success: false, error: "Invalid credentials." });
        }
        const valid = await bcryptjs_1.default.compare(password, user.password);
        if (!valid) {
            return res
                .status(400)
                .json({ success: false, error: "Invalid credentials." });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.json({
            success: true,
            token,
            user: {
                id: user._id, // 🔥 FIXED HERE AS WELL
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res
            .status(500)
            .json({ success: false, error: "Server error" });
    }
};
exports.login = login;
