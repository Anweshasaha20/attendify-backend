import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { reqLogger } from "./middlewares/reqLogger.middleware.js";
import routes from "./routes/index.routes.js";
import { PORT } from "./secrets.js";
import { ApiResponse } from "./utils/apiResponse.js";
import { apiRateLimiter } from "./middlewares/rateLimiter.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(reqLogger);

app.use("/api/v1",apiRateLimiter, routes);

app.get("/", (req, res) => {
  //to test if the server is up and running
  return res
    .status(200)
    .json(ApiResponse.success({ message: "🧑‍💻 App is running..." }));
});

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║             ATTENDIFY SERVER              ║
  ╚═══════════════════════════════════════════╝
  
  🚀 Server is started at https://localhost:${PORT}
  📝 Environment: ${process.env.NODE_ENV || "development"}
  ⚙️ ${" "}Started at: ${new Date().toLocaleString()}
  `);
});
