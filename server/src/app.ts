import cookieParser from "cookie-parser";
import cors from "cors"
import express from "express";
import authRoutes from "./routes/authRoutes"
import leadRoutes from "./routes/leadRoutes"
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/leads", leadRoutes)

export default app;
