import './config/env.js'
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import { connectDB } from './config/db.js'; // .js is necessary in db.js
import cors from 'cors'
import helmet from 'helmet'

const PORT = process.env.PORT || 5000;
const app = express();
app.set("trust proxy", 1);
connectDB();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json()); // This parse every req.body from every page
app.use(helmet()); // Helmet helps secure your Express apps by setting various HTTP headers
app.use(cookieParser()); // This parse every cookie from every page

app.use('/api/users', authRoutes); // this is the route for authentication

app.get('/health', (req, res) => {
    res.send("The server is healthy 🙂");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});