import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import PrayerSummarys from "./routes/prayers.js";



const app = express();
const port = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Configure CORS once with the necessary options
app.use(cors({
  origin: "http://localhost:5173", // if your frontend is on 3001, otherwise adjust accordingly
  credentials: true,
}));





// API Endpoints
app.use('/api/auth', authRouter);
<<<<<<< HEAD
=======

app.use('/api/prayers', PrayerSummarys);
>>>>>>> 8bb15db (kshd)
app.use("/api/users", userRoutes);





app.listen(port, () => {
  console.log(`Hello Server Listening on ${port}`);
});

