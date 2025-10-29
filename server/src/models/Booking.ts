// server/src/models/Booking.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  experienceId: Schema.Types.ObjectId;
  slotId: Schema.Types.ObjectId;
  startTime: Date; // Store the actual start time from the slot
  customerName: string;
  customerEmail: string;
  quantity: number;
  totalPrice: number;
  promoCode?: Schema.Types.ObjectId;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  experienceId: { type: Schema.Types.ObjectId, ref: 'Experience', required: true },
  slotId: { type: Schema.Types.ObjectId, ref: 'Slot', required: true },
  startTime: { type: Date, required: true },
  customerName: { type: String, required: true, trim: true },
  customerEmail: { type: String, required: true, trim: true, lowercase: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  totalPrice: { type: Number, required: true, min: 0 },
  promoCode: { type: Schema.Types.ObjectId, ref: 'PromoCode', required: false },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed', 
    required: true,
  },
  paymentId: { type: String, trim: true },
}, { timestamps: true }); 


BookingSchema.index({ customerEmail: 1 });
BookingSchema.index({ slotId: 1 });

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);