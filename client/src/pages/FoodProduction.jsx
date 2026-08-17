import React, { useEffect } from 'react';
import FPHero from '../components/food-production/FPHero';
import FPOverview from '../components/food-production/FPOverview';
import FPCurriculum from '../components/food-production/FPCurriculum';
import FPGallery from '../components/food-production/FPGallery';

export default function FoodProduction() {

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* Cinematic Dark Hero */}
      <FPHero />

      {/* Light Theme Narrative Hook */}
      <FPOverview />

      {/* Divided Layout Curriculum */}
      <FPCurriculum />

      {/* Parallax Masonry Gallery */}
      <FPGallery />
      
    </main>
  );
}