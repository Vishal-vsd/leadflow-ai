import dotenv from "dotenv";
import app from "./app";
import connectToDB from "./config/database";

dotenv.config();

const PORT = Number(process.env.PORT) || 8000;

const startServer = async () => {
  try {
    await connectToDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server",error);
    process.exit(1)
  }
};

void startServer();
