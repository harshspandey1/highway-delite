// server/src/index.ts (Corrected Version)

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db'; // Make sure this path is correct

// Import Routes
import experienceRoutes from './routes/experienceRoutes';
import bookingRoutes from './routes/bookingRoutes';
import promoCodeRoutes from './routes/promoCodeRoutes';

dotenv.config();

// Connect to Database
connectDB();

const app: Application = express();
// Railway will expose the port as an environment variable
// Using || 5001 is good for local development, but Railway uses process.env.PORT
const PORT = process.env.PORT || 5001; 

// Middleware
app.use(cors()); 
app.use(express.json()); 

// 💡 FIX: ADD ROOT ROUTE to prevent "Cannot GET /" error
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('BookIt Backend API is running successfully. Access endpoints via /api/.');
});

// API Routes
app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes); 
app.use('/api/promo-codes', promoCodeRoutes); 

// Existing Test Route
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'BookIt Backend API is running! 🚀' });
});

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});