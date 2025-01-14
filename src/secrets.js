import dotenv from "dotenv";

dotenv.config();

const validateEnv = () => {
  const requiredVars = [
    "PORT",
    "DATABASE_URL",
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
  ];
  const envVars = {};
  const missing = [];
  console.log("> Loading environment variables... from .env file");
  for (const key of requiredVars) {
    if (!process.env[key]) {
      missing.push(key);
    } else {
      envVars[key] = process.env[key];
    }
  }

  if (missing.length > 0) {
    console.error(
      "> ❌ Invalid/Missing environment variables:",
      missing.join(", ")
    );
    process.exit(1);
  }

  return envVars;
};

export const { PORT, DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET } =
  validateEnv();
