// server/src/routes/promoCodeRoutes.ts
import express from 'express';
import { applyPromoCode } from '../controllers/promoCodeController';

const router = express.Router();

// Route to apply a promo code
// POST /api/promo-codes/apply
router.post('/apply', applyPromoCode);

// Add other routes here if needed (e.g., GET /api/promo-codes to list all for admin)

export default router;