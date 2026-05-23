import './config/env.js'
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import { connectDB } from './config/db.js'; // .js is necessary in db.js
import cors from 'cors'

const PORT = process.env.PORT || 5000;
const app = express();
app.set("trust proxy", 1);
connectDB();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json()); // This parse every req.body from every page

app.use(cookieParser());

app.use('/api/users', authRoutes);

app.get('/health', (req, res) => {
    res.send("The server is healthy 🙂");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});