import cookieParser from "cookie-parser";
import cors from "cors"
import express from "express";
import authRoutes from "./routes/authRoutes"
import leadRoutes from "./routes/leadRoutes"
import adminRoutes from "./routes/adminRoutes"
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/leads", leadRoutes)
app.use("/api/admin", adminRoutes)

export default app;
