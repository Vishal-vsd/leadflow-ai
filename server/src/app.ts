import cookieParser from "cookie-parser";
import cors from "cors"
import express from "express";
import authRoutes from "./routes/authRoutes"
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRoutes)

app.get("/api/health", (req, res) => {

    console.log("Health Route Hitcurl -i http://localhost:5000/api/health")
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

export default app;
