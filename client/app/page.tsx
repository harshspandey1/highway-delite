"use client"; // Marks this as a Client Component

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react'; // Import React hooks

// Define Type
type Experience = {
  _id: string;
  title: string;
  description: string;
  location: string;
  basePrice: number;
  mainImage: string;
  duration: string;
};
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// Fetch Function
async function getExperiences(searchTerm: string) {
  try {
    // Use localhost
    const res = await fetch(`${BASE_URL}/api/experiences?search=${searchTerm}`, {
      cache: 'no-store', 
    });
    if (!res.ok) {
      throw new Error('Failed to fetch experiences');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return []; // Return empty array on error
  }
}

// Home Page Component
export default function Home() {
  const [allExperiences, setAllExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true); 

  // Effect 1: Fetch initial data robustly
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const data = await getExperiences(''); 
        setAllExperiences(data);
        setFilteredExperiences(data);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        setAllExperiences([]); 
        setFilteredExperiences([]);
      } finally {
        // Always set loading to false after the attempt
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []); // Empty dependency array means this runs only once on mount

  // Effect 2: Filter experiences based on searchTerm
  useEffect(() => {
    // Only filter if not in the initial loading state
    if (!isLoading) {
      if (searchTerm === '') {
        setFilteredExperiences(allExperiences); 
      } else {
        // Perform client-side filtering
        const filtered = allExperiences.filter(exp =>
          exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredExperiences(filtered);
      }
    }
  }, [searchTerm, allExperiences, isLoading]); // Re-run when these values change

  return (
    <>
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
            <input
              type="text"
              placeholder="Search experience"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD643] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update state on typing
            />
            {/* Button is present but doesn't need to submit */}
            <button type="button" className="px-4 py-2 bg-[#FFD643] text-black rounded-lg font-semibold hover:bg-[#FFD643]/90 transition-colors">
              Search
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-[124px] py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            <p>Loading...</p> // Show loading indicator
          ) : filteredExperiences.length > 0 ? (
            filteredExperiences.map((exp) => (
              <ExperienceCard key={exp._id} experience={exp} />
            ))
          ) : (
            <p>No experiences found matching your search.</p> // Message for no results
          )}
        </div>
      </main>
    </>
  );
}

// Experience Card Component 
function ExperienceCard({ experience }: { experience: Experience }) {
    return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
      <div className="relative w-full h-48">
        <Image
          src={experience.mainImage}
          alt={experience.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw" 
        />
      </div>
      <div className="p-4 bg-[#F0F0F0] flex flex-col grow">
        <div className="grow"> {/* Ensures text content pushes button down */}
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold">{experience.title}</h3>
            <span className="inline-block bg-[#D6D6D6] text-gray-800 text-xs font-medium px-2 py-1 rounded whitespace-nowrap">{experience.location}</span>
          </div>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{experience.description}</p>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <p className="text-lg font-semibold"><span className="text-sm font-normal text-gray-600">From </span>₹{experience.basePrice}</p>
          <Link href={`/experiences/${experience._id}`} className="px-4 py-2 bg-[#FFD643] text-black rounded-md text-sm font-semibold hover:bg-[#FFD643]/90 transition-colors">View Details</Link>
        </div>
      </div>
    </div>
  );
}