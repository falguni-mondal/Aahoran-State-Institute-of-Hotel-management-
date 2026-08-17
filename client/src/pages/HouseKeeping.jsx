import React, { useEffect } from 'react';
import HKHero from '../components/house-keeping/HKHero';
import HKOverview from '../components/house-keeping/HKOverview';
import HKCurriculum from '../components/house-keeping/HKCurriculum';
import HKGallery from '../components/house-keeping/HKGallery';

export default function HouseKeeping() {

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* Cinematic Dark Hero */}
      <HKHero />

      {/* Light Theme Narrative Hook */}
      <HKOverview />

      {/* Divided Layout Curriculum */}
      <HKCurriculum />

      {/* Parallax Masonry Gallery */}
      <HKGallery />
      
    </main>
  );
}