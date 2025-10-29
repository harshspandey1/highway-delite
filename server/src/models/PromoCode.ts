// server/src/models/PromoCode.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPromoCode extends Document {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  isActive: boolean;
  expiresAt?: Date;
  minOrderValue?: number;
  usageLimit?: number; 
  usedCount: number;  
  createdAt: Date;
  updatedAt: Date;
}

const PromoCodeSchema = new Schema<IPromoCode>({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['percentage', 'flat'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date },
  minOrderValue: { type: Number, default: 0 },
  usageLimit: { type: Number, min: 0 },
  usedCount: { type: Number, default: 0, min: 0 },
}, { timestamps: true });


PromoCodeSchema.index({ code: 1 });
PromoCodeSchema.index({ isActive: 1, expiresAt: 1 });

export default mongoose.models.PromoCode || mongoose.model<IPromoCode>('PromoCode', PromoCodeSchema);