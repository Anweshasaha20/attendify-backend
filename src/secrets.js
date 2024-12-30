import dotenv from "dotenv";

dotenv.config();

const validateEnv = () => {
  const requiredVars = ['PORT', 'DATABASE_URL'];
  const envVars = {};
  const missing = [];

  for (const key of requiredVars) {
    if (!process.env[key]) {
      missing.push(key);
    } else {
      envVars[key] = process.env[key];
    }
  }
  
  if (missing.length > 0) {
    console.error('> ❌ Invalid/Missing environment variables:', missing.join(', '));
    process.exit(1);
  }
  
  return envVars;
};

export const { PORT, DB_URL } = validateEnv();
