import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { connectDB } from './config/db.js'; // .js is necessary in db.js
import cors from 'cors'

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
connectDB();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json()); // This parse every req.body from every page

app.use(cookieParser());

app.use('/api/users', authRoutes);

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});