export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue
  if (!value) {
    throw new Error(`Environment variable ${key} is required`)
  }
  return value
}

export const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/interview-mind-pro",
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  NODE_ENV: process.env.NODE_ENV || "development",
}
