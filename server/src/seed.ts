// server/src/seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db';
import Experience from './models/Experience';
import Slot from './models/Slot';
import Booking from './models/Booking';
import PromoCode from './models/PromoCode';

dotenv.config();

// --- Sample Data ---
const experiences = [
  {
    title: 'Kayaking',
    description: 'Certified small-group experience. Certified guides.',
    about: 'Join us for a thrilling kayaking adventure through serene waters. This certified small-group experience ensures personalized attention from our certified guides. Perfect for both beginners and experienced kayakers. Paddles and life vests provided.',
    location: 'Central Reservoir',
    basePrice: 999,
    mainImage: 'https://images.pexels.com/photos/2403391/pexels-photo-2403391.jpeg',
    images: ['https://images.pexels.com/photos/2403391/pexels-photo-2403391.jpeg'],
    duration: '3 Hours',
  },
  {
    title: 'Nandi Hills Sunrise',
    description: 'Witness the breathtaking sunrise from Nandi Hills.',
    about: 'Experience the magic of dawn from one of the most scenic viewpoints. Our package includes transport and a guided trek to the best viewing spots. A truly unforgettable morning.',
    location: 'Nandi Hills',
    basePrice: 1199,
    mainImage: 'https://images.pexels.com/photos/1687574/pexels-photo-1687574.jpeg',
    images: ['https://images.pexels.com/photos/1687574/pexels-photo-1687574.jpeg'],
    duration: '1 Day',
  },
  {
    title: 'Coffee Trail',
    description: 'Explore the lush coffee plantations of Coorg.',
    about: 'Walk through aromatic coffee estates, learn about the bean-to-cup process, and savor a freshly brewed cup. This guided trail is a sensory delight for all coffee lovers.',
    location: 'Coorg',
    basePrice: 1299,
    mainImage: 'https://images.pexels.com/photos/982635/pexels-photo-982635.jpeg',
    images: ['https://images.pexels.com/photos/982635/pexels-photo-982635.jpeg'],
    duration: '1 Day',
  },
];

const promoCodes = [
  { code: 'SAVE10', discountType: 'percentage', discountValue: 10, isActive: true },
  { code: 'FLAT100', discountType: 'flat', discountValue: 100, isActive: true },
];

const importData = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected...');

    
    await Experience.deleteMany();
    await Slot.deleteMany(); 
    await Booking.deleteMany();
    await PromoCode.deleteMany();
    console.log('Old data cleared...');

    const createdExperiences = await Experience.insertMany(experiences);
    await PromoCode.insertMany(promoCodes);
    console.log('Sample experiences and promo codes inserted...');

    // --- Define Dates ---
    const today = new Date();
    today.setHours(9, 0, 0, 0); // Start at 9:00 AM today (local time)

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set to tomorrow

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2); // Set to day after tomorrow

    
    const kayakingExp = createdExperiences[0];
    const kayakingSlots = [
      { experienceId: kayakingExp._id, startTime: today, totalCapacity: 10, bookedCount: 8 }, // 9:00 AM Today (2 left)
      { experienceId: kayakingExp._id, startTime: new Date(today.getTime() + (2 * 60 * 60 * 1000)), totalCapacity: 10, bookedCount: 10 }, 
      { experienceId: kayakingExp._id, startTime: new Date(today.getTime() + (4 * 60 * 60 * 1000)), totalCapacity: 10, bookedCount: 0 }, 
    ];
    await Slot.insertMany(kayakingSlots);
    console.log('Sample slots for Kayaking inserted...');

    
    const nandiHillsExp = createdExperiences[1];
    const nandiHillsSlots = [
      { experienceId: nandiHillsExp._id, startTime: tomorrow, totalCapacity: 20, bookedCount: 5 }, // 9:00 AM Tomorrow
      { experienceId: nandiHillsExp._id, startTime: new Date(tomorrow.getTime() + (2 * 60 * 60 * 1000)), totalCapacity: 20, bookedCount: 18 }, 
    ];
    await Slot.insertMany(nandiHillsSlots);
    console.log('Sample slots for Nandi Hills inserted...');

   
    const coffeeTrailExp = createdExperiences[2];
    const coffeeTrailSlots = [
      { experienceId: coffeeTrailExp._id, startTime: dayAfterTomorrow, totalCapacity: 12, bookedCount: 12 }, 
      { experienceId: coffeeTrailExp._id, startTime: new Date(dayAfterTomorrow.getTime() + (2 * 60 * 60 * 1000)), totalCapacity: 12, bookedCount: 0 }, 
      { experienceId: coffeeTrailExp._id, startTime: new Date(dayAfterTomorrow.getTime() + (4 * 60 * 60 * 1000)), totalCapacity: 12, bookedCount: 4 }, 
    ];
    await Slot.insertMany(coffeeTrailSlots);
    console.log('Sample slots for Coffee Trail inserted...');

    console.log('Data seeding complete!');
    process.exit(0); // Success

  } catch (error) {
    console.error(`Error with data seeding: ${error}`);
    process.exit(1); // Failure
  }
};

importData();