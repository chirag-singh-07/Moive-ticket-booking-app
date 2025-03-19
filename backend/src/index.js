import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import UserRoute from "./routes/UserRoute.js";
import connectDB from "./utils/database.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
connectDB();

app.get("/", (req, res) => {
  res.send("API is running....");
});
app.use("/api/auth", UserRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
