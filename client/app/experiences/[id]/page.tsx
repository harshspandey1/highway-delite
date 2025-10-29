"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';

// --- Type Definitions ---
type Experience = {
  _id: string;
  title: string;
  description: string;
  about: string;
  location: string;
  basePrice: number;
  mainImage: string;
  duration: string;
};

type Slot = {
  _id: string;
  experienceId: string;
  startTime: string; 
  totalCapacity: number; 
  bookedCount: number;   
};

// --- Helper Functions ---
async function getExperience(id: string): Promise<Experience | null> {
  try {
    // Use localhost
    const res = await fetch(`http://localhost:5001/api/experiences/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch experience');
    return res.json();
  } catch (error) {
    console.error('Error fetching experience:', error);
    return null;
  }
}

async function getSlots(id: string): Promise<Slot[]> {
  try {
    // Use localhost
    const res = await fetch(`http://localhost:5001/api/experiences/${id}/slots`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch slots');
    return res.json();
  } catch (error) {
    console.error('Error fetching slots:', error);
    return [];
  }
}

// --- Utility Functions ---
const formatDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

// --- Details Page Component ---
export default function ExperienceDetailsPage() {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Fetch data
  useEffect(() => {
    // Check if ID is valid before fetching
    if (id && id !== "undefined") {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [expData, slotData] = await Promise.all([
            getExperience(id),
            getSlots(id)
          ]);
          setExperience(expData);
          setSlots(slotData);
        } catch (error) {
            console.error("Failed to fetch details data:", error);
            setExperience(null);
            setSlots([]);
        } finally {
            setIsLoading(false); 
        }
      };
      fetchData();
    } else if (id) {
        // Handle the case where id is initially "undefined"
      setIsLoading(false);
    }
  }, [id]); // Dependency array ensures fetch runs when ID is available

  // Memoized calculations
  const slotsByDate = useMemo(() => {
    return slots.reduce((acc, slot) => {
      const dateKey = slot.startTime.split('T')[0];
      if (!acc[dateKey]) { acc[dateKey] = []; }
      acc[dateKey].push(slot);
      return acc;
    }, {} as Record<string, Slot[]>);
  }, [slots]);

  const availableDates = useMemo(() =>
    slotsByDate ? Object.keys(slotsByDate).sort() : [], // Safely get keys
  [slotsByDate]);

  const timeSlotsForSelectedDate = useMemo(() =>
    selectedDate && slotsByDate ? slotsByDate[selectedDate] || [] : [],
  [selectedDate, slotsByDate]);

  const isConfirmEnabled = selectedDate !== null && selectedSlotId !== null;

  // Handlers
  const handleDateSelect = (dateKey: string) => {
    setSelectedDate(dateKey);
    setSelectedSlotId(null);
  };
  const handleTimeSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
  };
  const handleConfirm = () => {
    if (!isConfirmEnabled || !experience || !selectedSlotId) return;
    const selectedSlot = slots.find(slot => slot._id === selectedSlotId);
    const queryParams = new URLSearchParams({
      experienceId: experience._id,
      title: experience.title,
      slotId: selectedSlotId,
      startTime: selectedSlot ? selectedSlot.startTime : '',
      basePrice: experience.basePrice.toString(),
    });
    router.push(`/checkout?${queryParams.toString()}`);
  };

  // Render Logic
  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (!experience) return <p className="text-center py-10">Experience not found.</p>;

  const subtotal = experience.basePrice;
  const taxes = subtotal * 0.1;
  const total = subtotal + taxes;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <nav className="flex items-center justify-between h-[87px] max-w-[1440px] mx-auto px-[124px] py-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png" 
              alt="Highway Delite Logo"
              width={100} 
              height={30} 
              priority 
            />
          </Link>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Search experience" className="px-4 py-2 border border-gray-300 rounded-lg"/>
            <button className="px-4 py-2 bg-[#FFD643] text-black rounded-lg font-semibold hover:bg-[#FFD643]/90">Search</button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-[124px] py-12 flex-grow">
        <Link href="/" className="text-sm font-medium text-gray-600 mb-4 inline-block">&larr; Back to Experiences</Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
              <Image
                src={experience.mainImage}
                alt={experience.title}
                fill
                className="object-cover"
                priority 
                sizes="(max-width: 1024px) 100vw, 66vw" 
              />
            </div>
            <h1 className="text-3xl font-bold">{experience.title}</h1>
            <p className="text-gray-600">{experience.description}</p>
            {/* --- Slot Picker --- */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose date</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {availableDates.length > 0 ? availableDates.map(dateKey => (
                  <button key={dateKey} onClick={() => handleDateSelect(dateKey)} className={`px-4 py-2 rounded-md border text-sm font-medium ${selectedDate === dateKey ? 'bg-[#FFD643] border-[#FFD643]' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}`}>{formatDate(dateKey)}</button>
                )) : <p className="text-sm text-gray-500">No available dates.</p>}
              </div>
              {selectedDate && (
                 <div>
                    <h3 className="text-lg font-semibold mb-4">Choose time</h3>
                    <div className="flex flex-wrap gap-2">
                       {timeSlotsForSelectedDate.length > 0 ? timeSlotsForSelectedDate.map(slot => {
                          const isAvailable = slot.bookedCount < slot.totalCapacity;
                          const spotsLeft = slot.totalCapacity - slot.bookedCount;
                          const isSelected = slot._id === selectedSlotId;
                          return (
                             <button key={slot._id} onClick={() => isAvailable && handleTimeSelect(slot._id)} disabled={!isAvailable} className={`px-4 py-2 rounded-md border text-sm font-medium flex items-center justify-center gap-2 relative ${ isSelected ? 'bg-[#FFD643] border-[#FFD643]' : isAvailable ? 'bg-gray-100 border-gray-300 hover:bg-gray-200' : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-60'}`}>
                                <span className={!isAvailable ? 'line-through' : ''}>{formatTime(slot.startTime)}</span>
                                {!isAvailable ? (<span className="text-xs text-gray-500 font-normal">(Sold out)</span>) : spotsLeft > 0 ? (<span className="text-xs text-red-600 font-semibold">({spotsLeft} left)</span>) : null}
                             </button>
                          );
                       }) : <p className="text-sm text-gray-500">No available times for this date.</p>}
                    </div>
                 </div>
              )}
            </div>
            {/* --- End Slot Picker --- */}
            <h2 className="text-xl font-semibold mb-2 pt-4">About</h2>
            <p className="text-gray-700 leading-relaxed">{experience.about}</p>
          </div>
          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-[#F0F0F0] rounded-lg p-6 shadow-md sticky top-[115px]">
              <h2 className="text-xl font-bold mb-4">Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between"><span>Starts at</span><span>₹{subtotal.toFixed(0)}</span></div>
                <div className="flex justify-between"><span>Quantity</span><span>1</span></div>
                <div className="flex justify-between text-gray-600"><span>Taxes</span><span>₹{taxes.toFixed(0)}</span></div>
                <hr className="border-gray-400 my-3"/>
                <div className="flex justify-between text-lg font-bold"><span>Total</span><span>₹{total.toFixed(0)}</span></div>
              </div>
              <button disabled={!isConfirmEnabled} onClick={handleConfirm} className={`w-full text-black rounded-lg py-3 font-semibold transition-colors ${ isConfirmEnabled ? 'bg-[#FFD643] hover:bg-[#FFD643]/90' : 'bg-gray-300 cursor-not-allowed'}`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}