// server/src/index.ts
import express, { Application, Request, Response } from 'express'; // Added Application type
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import experienceRoutes from './routes/experienceRoutes';


import bookingRoutes from './routes/bookingRoutes'; // Import booking routes
import promoCodeRoutes from './routes/promoCodeRoutes'; // Import promo code routes

dotenv.config();

connectDB();

const app: Application = express(); // Use Application type
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// API Routes
app.use('/api/experiences', experienceRoutes);

app.use('/api/bookings', bookingRoutes); 
app.use('/api/promo-codes', promoCodeRoutes); 

// Simple Test Route
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'BookIt Backend is running! 🚀' });
});

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});