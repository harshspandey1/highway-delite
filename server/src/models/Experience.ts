// server/src/models/Experience.ts
import mongoose from 'mongoose';

// Interface for TypeScript to understand the Experience document
export interface IExperience extends mongoose.Document {
  title: string;
  description: string;
  about: string;
  location: string;
  basePrice: number;
  mainImage: string;
  images: string[];
  duration: string; 
}

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }, 
  about: { type: String, required: true }, 
  location: { type: String, required: true },
  basePrice: { type: Number, required: true }, 
  mainImage: { type: String, required: true }, 
  images: [{ type: String }],
  duration: { type: String, required: true, default: '1 Day' }, 
}, { timestamps: true });

// Export the model.
export default mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);