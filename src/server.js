import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import reqLogger from "./middlewares/reqLogger.middleware.js";
import routes from "./routes/index.routes.js";
import { PORT } from "./secrets.js";
import ApiResponse from "./utils/apiResponse.js";
import apiRateLimiter from "./middlewares/rateLimiter.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(reqLogger);

app.use("/api/v1", apiRateLimiter, routes);

app.listen(PORT, () => {
  console.log(`
╭───────────────────────────────────────────────╮
│                 ATTENDIFY SERVER              │
├───────────────────────────────────────────────┤
│ 🚀 Status:           RUNNING                  │
│  🌐 Address:          https://localhost:${PORT}  │
│ 📝 Environment:      ${process.env.NODE_ENV || "development"}              │
│ ⏰ Start Time:       ${new Date().toLocaleString()}    │
│ 📡 API Endpoint:     /api/v1                  │
╰───────────────────────────────────────────────╯
`);
});
