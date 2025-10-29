// server/src/models/Slot.ts
import mongoose from 'mongoose';

export interface ISlot extends mongoose.Document {
  experienceId: mongoose.Schema.Types.ObjectId;
  startTime: Date;
  totalCapacity: number; 
  bookedCount: number;   
}

const SlotSchema = new mongoose.Schema({
  experienceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: true,
  },
  startTime: { type: Date, required: true },
  totalCapacity: { type: Number, required: true, default: 15 }, 
  bookedCount: { type: Number, required: true, default: 0 },   
}, { timestamps: true });

export default mongoose.models.Slot || mongoose.model<ISlot>('Slot', SlotSchema);