// server/src/routes/bookingRoutes.ts
import express from 'express';
import { createBooking } from '../controllers/bookingController';
// Add imports for other booking actions (get, update, delete) if needed later

const router = express.Router();

// Route to create a new booking
// POST /api/bookings
router.post('/', createBooking);

// Add other routes here, e.g., GET /api/bookings/:id

export default router;