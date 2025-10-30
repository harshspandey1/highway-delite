import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db'; 

import experienceRoutes from './routes/experienceRoutes';
import bookingRoutes from './routes/bookingRoutes';
import promoCodeRoutes from './routes/promoCodeRoutes';

dotenv.config();

connectDB();

const app: Application = express();
const PORT = process.env.PORT || 5001; 

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('BookIt Backend API is running successfully. Access endpoints via /api/.');
});

app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes); 
app.use('/api/promo-codes', promoCodeRoutes); 

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'BookIt Backend API is running! 🚀' });
});

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});