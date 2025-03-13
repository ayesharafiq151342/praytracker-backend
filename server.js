import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import prayersRouter from './routes/prayers.js';
import path from 'path';
import { fileURLToPath } from 'url';
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
  origin: "http://localhost:3000", // if your frontend is on 3001, otherwise adjust accordingly
  credentials: true,
}));


app.get('/', (req, res) => {
  res.send("API Working");
});

// API Endpoints
app.use('/api/auth', authRouter);

app.use('/api/prayers', prayersRouter);
app.use("/api/users", userRoutes);


app.listen(port, () => {
  console.log(`Hello Server Listening on ${port}`);
});

