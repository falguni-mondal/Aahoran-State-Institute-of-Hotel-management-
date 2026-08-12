import React, { useEffect } from 'react';
import CFHero from '../components/campus-facilities/CFHero';
import CFGallery from '../components/campus-facilities/CFGallery';

// Structured data mapping for the facilities based on your screenshots
const facilitiesData = [
  {
    id: 'library',
    title: 'Library',
    images: [
      { src: '/library_1.jpg', alt: 'Students studying at desks in the library' },
      { src: '/library_2.jpg', alt: 'Student reading newspaper in the library' },
      { src: '/library_3.jpg', alt: 'Students researching in the library' },
    ]
  },
  {
    id: 'canteen',
    title: 'Canteen',
    images: [
      { src: '/canteen_1.jpg', alt: 'Students enjoying a meal together in the canteen' },
      { src: '/canteen_2.jpg', alt: 'Students being served at the canteen counter' },
      { src: '/canteen_3.jpg', alt: 'Close up of the fresh food serving station' },
    ]
  }
];

export default function CampusFacilities() {
  
  // Forces scroll reset on mount for smooth Lenis/GSAP integration
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* 1. Immersive Cinematic Hero */}
      <CFHero />

      {/* 2. Editorial Gallery Sections */}
      <div className="flex flex-col">
        {facilitiesData.map((facility, index) => (
          <CFGallery 
            key={facility.id}
            title={facility.title}
            images={facility.images}
            index={index}
          />
        ))}
      </div>
      
    </main>
  );
}