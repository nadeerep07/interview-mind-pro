import dotenv from "dotenv";
dotenv.config();
console.log("ENV LOADED:", {
  GROQ_API_KEY: process.env.GROQ_API_KEY ? "OK" : "MISSING",
  GROQ_MODEL: process.env.GROQ_MODEL ? "OK" : "MISSING",
});
