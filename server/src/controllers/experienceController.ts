// server/src/controllers/experienceController.ts
import { Request, Response } from 'express';
import Experience from '../models/Experience';
import Slot from '../models/Slot'; // Import Slot model

/**
 * @desc    Get all experiences (with optional search)
 * @route   GET /api/experiences
 * @access  Public
 */
export const getExperiences = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.search ? {
      $or: [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } },
      ],
    } : {};

    const experiences = await Experience.find({ ...searchTerm });
    
    res.status(200).json(experiences);
  } catch (error: any) {
    console.error(`--- BACKEND Error (getExperiences): ${error.message} ---`);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

/**
 * @desc    Get a single experience by ID
 * @route   GET /api/experiences/:id
 * @access  Public
 */
export const getExperienceById = async (req: Request, res: Response) => {
  console.log(`--- BACKEND: Received request for ID: ${req.params.id} ---`);
  try {
    const experience = await Experience.findById(req.params.id);

    if (experience) {
      console.log('--- BACKEND: Found experience, sending 200 ---');
      res.status(200).json(experience);
    } else {
      console.log('--- BACKEND: Experience not found, sending 404 ---');
      res.status(404).json({ message: 'Experience not found' });
    }
  } catch (error: any) {
    console.error(`--- BACKEND Error (getExperienceById): ${error.message} ---`);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

/**
 * @desc    Get available slots for a single experience
 * @route   GET /api/experiences/:id/slots
 * @access  Public
 */
export const getExperienceSlots = async (req: Request, res: Response) => {
  try {
    const slots = await Slot.find({ 
      experienceId: req.params.id,
      startTime: { $gte: new Date() } 
    }).sort({ startTime: 1 }); 


    if (slots) { 
      res.status(200).json(slots); 
    } 
    // No need for an else here, as an empty array is a valid response
  } catch (error: any) {
    console.error(`--- BACKEND Error (getExperienceSlots): ${error.message} ---`);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};