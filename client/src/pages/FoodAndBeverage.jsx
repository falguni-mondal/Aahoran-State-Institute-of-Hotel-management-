import React, { useEffect } from 'react';
import FBHero from '../components/food-beverage/FBHero';
import FBOverview from '../components/food-beverage/FBOverview';
import FBCurriculum from '../components/food-beverage/FBCurriculum';
import FBGallery from '../components/food-beverage/FBGallery';

export default function FoodAndBeverage() {

  return (
    <main className="w-full bg-[var(--background)] min-h-screen selection:bg-[var(--accent)] selection:text-[var(--primary-base)]">
      
      {/* Cinematic Dark Hero */}
      <FBHero />

      {/* Light Theme Narrative Hook */}
      <FBOverview />

      {/* Dark Theme Curriculum with Sticky Sidebar */}
      <FBCurriculum />

      {/* Light Theme Parallax Masonry Gallery */}
      <FBGallery />
      
    </main>
  );
}