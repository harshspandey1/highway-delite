// server/src/controllers/promoCodeController.ts
import { Request, Response } from 'express';
import PromoCode from '../models/PromoCode';

// @desc    Apply a promo code
// @route   POST /api/promo-codes/apply
// @access  Public (adjust access control if needed)
export const applyPromoCode = async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Promo code is required.' });
  }

  try {
    // Find active promo code matching the input code (case-insensitive)
    const promoCode = await PromoCode.findOne({
        code: code.toUpperCase(), // Store and check codes in uppercase
        isActive: true,
        
    });

    if (!promoCode) {
      return res.status(404).json({ message: 'Invalid or inactive promo code.' });
    }

    // Optional: Check usage limits if implemented
    if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
        return res.status(400).json({ message: 'Promo code has reached its usage limit.' });
    }

    // Return only necessary details to the frontend
    res.status(200).json({
      message: 'Promo code applied successfully!',
      promoCode: {
        _id: promoCode._id, // Send ID for booking creation
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
        
      },
    });
  } catch (error: any) {
    console.error(`Error applying promo code: ${error.message}`);
    res.status(500).json({ message: 'Server error while applying promo code.' });
  }
};