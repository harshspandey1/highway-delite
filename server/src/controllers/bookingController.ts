// server/src/controllers/bookingController.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose'; 
import Booking from '../models/Booking';
import Slot from '../models/Slot';
import Experience from '../models/Experience'; 
import PromoCode from '../models/PromoCode';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public (adjust access control if needed)
export const createBooking = async (req: Request, res: Response) => {
  const {
    experienceId,
    slotId,
   
    customerName,
    customerEmail,
    quantity = 1, // Default quantity to 1 if not provided
    totalPrice,
    promoCode: promoCodeId,
  } = req.body;

  // --- Input Validation ---
  if (!experienceId || !slotId || !customerName || !customerEmail || totalPrice === undefined) {
    return res.status(400).json({ message: 'Missing required booking details.' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // --- Find Related Documents (within transaction) ---
    const experience = await Experience.findById(experienceId).session(session);
    if (!experience) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Experience not found.' });
    }

    const slot = await Slot.findById(slotId).session(session);
    if (!slot) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Selected slot not found.' });
    }

    // --- Check Slot Availability (within transaction) ---
    if (slot.bookedCount + quantity > slot.totalCapacity) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Not enough available capacity in this slot. Please try another.' });
    }

    // --- Validate Promo Code (if provided, within transaction) ---
    let appliedPromoCode = null;
    let calculatedDiscount = 0;
    if (promoCodeId) {
      appliedPromoCode = await PromoCode.findById(promoCodeId).session(session);
      if (!appliedPromoCode || !appliedPromoCode.isActive) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'Applied promo code is invalid or inactive.' });
      }
      // Check usage limit again on the server-side
      if (appliedPromoCode.usageLimit && appliedPromoCode.usedCount >= appliedPromoCode.usageLimit) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({ message: 'Promo code usage limit reached.' });
      }

      // Recalculate discount on server for security
      if (appliedPromoCode.discountType === 'percentage') {
        calculatedDiscount = (experience.basePrice * quantity) * (appliedPromoCode.discountValue / 100);
      } else { // 'flat'
        calculatedDiscount = appliedPromoCode.discountValue;
      }
      calculatedDiscount = Math.min(calculatedDiscount, experience.basePrice * quantity); 

      // Increment promo code usage count
      appliedPromoCode.usedCount += 1;
      await appliedPromoCode.save({ session });
    }

    // --- Server-Side Price Calculation (important for security) ---
    const serverSubtotal = experience.basePrice * quantity;
    const serverTaxes = (serverSubtotal - calculatedDiscount) * 0.1; // Apply tax after discount
    const serverTotalPrice = Math.max(0, serverSubtotal - calculatedDiscount + serverTaxes);


    // --- Create the Booking (within transaction) ---
    const newBookingData = {
      experienceId,
      slotId,
      startTime: slot.startTime, 
      customerName,
      customerEmail,
      quantity,
      totalPrice: serverTotalPrice, 
      promoCode: appliedPromoCode ? appliedPromoCode._id : undefined,
      status: 'confirmed', 
    };

    const bookingResult = await Booking.create([newBookingData], { session });
    const newBooking = bookingResult[0];

    // --- Update Slot Capacity (within transaction) ---
    slot.bookedCount += quantity;
    await slot.save({ session });

    // --- Commit Transaction ---
    await session.commitTransaction();
    session.endSession();

    // --- Respond with Success ---
    console.log(`Booking created successfully: ${newBooking._id}`);
    res.status(201).json({
      message: 'Booking created successfully!',
      booking: newBooking,
    });

  } catch (error: any) {
    // --- Rollback Transaction on Error ---
    await session.abortTransaction();
    session.endSession();
    console.error(`Error creating booking: ${error.message}`);
    // Provide a more generic error message to the client
    res.status(500).json({ message: 'An error occurred during booking. Please try again later.' });
  }
};