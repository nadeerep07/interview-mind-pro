"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("ENV LOADED:", {
    GROQ_API_KEY: process.env.GROQ_API_KEY ? "OK" : "MISSING",
    GROQ_MODEL: process.env.GROQ_MODEL ? "OK" : "MISSING",
});
