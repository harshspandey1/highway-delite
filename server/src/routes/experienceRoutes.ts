// server/src/routes/experienceRoutes.ts
import { Router } from 'express';
// 👇 This line was the problem. It should import these two functions:
import { getExperiences, getExperienceById ,getExperienceSlots} from '../controllers/experienceController';

const router = Router();

// GET /api/experiences
router.get('/', getExperiences);

// GET /api/experiences/:id
router.get('/:id', getExperienceById);

// GET /api/experiences/:id/slots
router.get('/:id/slots', getExperienceSlots);


export default router;